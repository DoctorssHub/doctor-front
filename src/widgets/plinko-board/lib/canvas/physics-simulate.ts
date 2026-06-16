import {
  getBallRadius,
  getBoardWidth,
  getPegPosition,
  getPegRadius,
} from "@/widgets/plinko-board/lib/animation";
import {
  baseGravity,
  fixedStepMs,
  horizontalDamping,
  maxDurationMs,
  verticalDamping,
  wallRestitution,
} from "./physics-constants";
import {
  getNearestCollidingPeg,
  resolvePegCollision,
} from "./physics-collision";
import {
  getInterpolatedPyramidBound,
  getPegs,
  getPyramidBounds,
  getTargetBucketGeometry,
  isInsideTargetBucket,
} from "./physics-geometry";
import { clamp } from "./physics-math";
import { settleMotionInTargetBucket } from "./physics-settle";
import type {
  BallMotion,
  BallSimulationParams,
  ImpactEvent,
  SimulationFrame,
} from "./physics-types";

export type SimulationResult = {
  isTargetBucketHit: boolean;
  // Whether the ball hit the side rail. Used by the offline table generator to
  // prefer rail-free trajectories (see docs/plinko-landing-table.md); unused at
  // runtime. Peg-hit count is available via motion.impactEvents.length.
  touchedRail: boolean;
  motion: BallMotion;
};

// Live ball physics: gravity, damping, peg collisions and wall bounces.
//
// `isTargetBucketHit` always reports whether the *natural* trajectory ended
// inside the target bucket — this is what the landing-table generator records
// and what the verifier asserts.
//
// `correctOnMiss` is the runtime safety guard: when the natural landing missed
// (only possible with a stale/incomplete table), ease the ball into the target
// bucket so the shown bucket can never disagree with the backend payout. It is
// off by default so tooling sees pure, uncorrected physics.
export function simulateBallMotion({
  bucketIndex,
  correctOnMiss = false,
  initialVelocityX,
  layout = "regular",
  rows,
  seedValue,
}: BallSimulationParams & {
  correctOnMiss?: boolean;
  initialVelocityX: number;
  seedValue: number;
}): SimulationResult {
  const boardWidth = getBoardWidth(layout);
  const ballRadius = getBallRadius(rows, layout);
  const pegs = getPegs(rows, layout);
  const pyramidBounds = getPyramidBounds(rows, layout, ballRadius);
  const target = getTargetBucketGeometry(bucketIndex, rows, layout);
  const gravity = baseGravity * (0.96 + seedValue * 0.08);
  const initialVelocityY = 72 + seedValue * 34;
  const firstRowLeftPeg = getPegPosition(0, 0, rows, layout);
  const firstRowRightPeg = getPegPosition(0, 2, rows, layout);
  const pegRadius = getPegRadius(rows, layout);
  const firstRowSpan = firstRowRightPeg.x - firstRowLeftPeg.x;
  // Start the ball 2px above the first peg row, leaning the drop point toward
  // the target bucket's side (plus a little seeded variety). Starting nearer the
  // target shortens the path and keeps the ball off the containment rail, and
  // the off-centre drop makes the first contact a natural glancing deflection.
  const targetSpawnFraction = clamp(
    (target.x - firstRowLeftPeg.x) / (firstRowSpan || 1),
    0,
    1,
  );
  const spawnFraction = clamp(
    targetSpawnFraction * 0.65 + seedValue * 0.35,
    0,
    1,
  );
  const position = {
    x: firstRowLeftPeg.x + firstRowSpan * spawnFraction,
    y: firstRowLeftPeg.y - (ballRadius + pegRadius) - 2,
  };
  const velocity = {
    x: initialVelocityX,
    y: initialVelocityY,
  };
  const frames: SimulationFrame[] = [
    {
      ballPosition: { ...position },
      timeMs: 0,
    },
  ];
  const impactEvents: ImpactEvent[] = [];
  let hasContacted = false;
  let touchedRail = false;

  for (
    let elapsedMs = fixedStepMs;
    elapsedMs <= maxDurationMs;
    elapsedMs += fixedStepMs
  ) {
    const dtSeconds = fixedStepMs / 1000;
    const previousPosition = { ...position };

    velocity.y += gravity * dtSeconds;
    velocity.x *= horizontalDamping;
    velocity.y *= verticalDamping;
    // Hold the seeded horizontal "aim" velocity until the ball first touches a
    // peg, so the drop reads as a clean vertical fall onto the first row rather
    // than sliding sideways. After the first contact the ball moves sideways
    // only as a consequence of a hit, like a real Plinko drop.
    if (hasContacted) {
      position.x += velocity.x * dtSeconds;
    }
    position.y += velocity.y * dtSeconds;

    // Side rails sit right on the outermost peg line, so on the rare path that
    // reaches the edge the bounce coincides with the visible pegs instead of an
    // invisible wall. `getPyramidBounds` pads each row by `ballRadius * 3`, so
    // adding it back lands the rail exactly on the outer peg line. Below the last
    // row there is no bound: fall back to the board walls for the bucket zone.
    const railBound = getInterpolatedPyramidBound(pyramidBounds, position.y);
    const leftLimit = railBound ? railBound.left + ballRadius * 3 : ballRadius;
    const rightLimit = railBound
      ? railBound.right - ballRadius * 3
      : boardWidth - ballRadius;

    if (position.x < leftLimit) {
      position.x = leftLimit;
      velocity.x = Math.abs(velocity.x) * wallRestitution;
      touchedRail = true;
    } else if (position.x > rightLimit) {
      position.x = rightLimit;
      velocity.x = -Math.abs(velocity.x) * wallRestitution;
      touchedRail = true;
    }

    const impact = getNearestCollidingPeg(
      previousPosition,
      position,
      velocity,
      pegs,
      ballRadius,
    );

    if (impact) {
      const impactPosition = resolvePegCollision(
        position,
        velocity,
        impact.peg,
        ballRadius,
        impact.position,
      );

      if (impactPosition) {
        hasContacted = true;
        impactEvents.push({
          position: impactPosition,
          timeMs: elapsedMs,
        });
      }
    }

    frames.push({
      ballPosition: { ...position },
      timeMs: elapsedMs,
    });

    if (position.y >= target.y) {
      break;
    }
  }

  const naturalPosition = frames[frames.length - 1].ballPosition;
  const yShortfall = Math.max(0, target.y - naturalPosition.y);
  const isTargetBucketHit =
    yShortfall <= ballRadius * 0.5 &&
    isInsideTargetBucket(naturalPosition, target, ballRadius);

  if (correctOnMiss && !isTargetBucketHit) {
    settleMotionInTargetBucket(frames, target, ballRadius);
  }

  const lastFrame = frames[frames.length - 1];

  return {
    isTargetBucketHit,
    touchedRail,
    motion: {
      durationMs: lastFrame.timeMs,
      finalPosition: lastFrame.ballPosition,
      frames,
      impactEvents,
    },
  };
}
