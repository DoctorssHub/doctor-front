import {
  type BoardLayout,
  getBallRadius,
  getBoardWidth,
  getPegPosition,
  getPegRadius,
} from "@/widgets/plinko-board/lib/animation";
import {
  getBallMotionCacheKey,
  getCachedBallMotion,
  getCachedInitialVelocity,
  getInitialVelocityCacheKey,
  setCachedBallMotion,
  setCachedInitialVelocity,
} from "./physics-cache";
import {
  baseGravity,
  candidateVelocityStep,
  fixedStepMs,
  horizontalDamping,
  maxCandidateVelocityX,
  maxDurationMs,
  minCandidateVelocityX,
  refinedCandidateVelocityStep,
  verticalDamping,
  wallRestitution,
} from "./physics-constants";
import {
  getNearestCollidingPeg,
  resolvePegCollision,
} from "./physics-collision";
import {
  getInterpolatedPyramidBound,
  getOutsidePyramidDistance,
  getPegs,
  getPyramidBounds,
  getTargetBucketGeometry,
} from "./physics-geometry";
import { clamp, getSeedValue } from "./physics-math";
import { calculateSimulationScore } from "./physics-scoring";
import { settleMotionInTargetBucket } from "./physics-settle";
import {
  applyTimingScale,
  getRowsTimingScale,
} from "./physics-timing";
import type {
  BallMotion,
  BallSimulationParams,
  ImpactEvent,
  SimulationFrame,
} from "./physics-types";
import { getSeededInitialVelocityX } from "./physics-velocity";

export type { BallMotion } from "./physics-types";
export { getBallFrame } from "./physics-frame";
export {
  getBallMotionCacheKey,
  getInitialVelocityCacheKey,
} from "./physics-cache";

function getBestCandidate<T extends { score: number }>(candidates: T[]) {
  return candidates.reduce((best, candidate) =>
    candidate.score < best.score ? candidate : best,
  );
}

function getCandidateWindow(
  bucketIndex: number,
  layout: BoardLayout,
  rows: number,
  seedValue: number,
  centerVelocityX: number,
  radius: number,
  step: number,
) {
  const candidates = [];

  for (
    let velocityX = centerVelocityX - radius;
    velocityX <= centerVelocityX + radius;
    velocityX += step
  ) {
    candidates.push(
      simulateBallMotion({
        bucketIndex,
        initialVelocityX: velocityX,
        layout,
        rows,
        seedValue,
      }),
    );
  }

  return candidates;
}

function getSelectedCandidate<T extends {
  isTargetBucketHit: boolean;
  score: number;
  staysInPyramid: boolean;
  touchedRail: boolean;
}>(candidates: T[], fallbackCandidate: T) {
  // Best of all worlds: the ball reaches the target while only ever bouncing
  // off pegs (never the containment rail). Fall back progressively if no such
  // trajectory exists for this bucket.
  const railFreeCandidates = candidates.filter(
    (candidate) => candidate.isTargetBucketHit && !candidate.touchedRail,
  );
  const strictValidCandidates = candidates.filter(
    (candidate) => candidate.isTargetBucketHit && candidate.staysInPyramid,
  );
  const targetBucketCandidates = candidates.filter(
    (candidate) => candidate.isTargetBucketHit,
  );

  return railFreeCandidates.length > 0
    ? getBestCandidate(railFreeCandidates)
    : strictValidCandidates.length > 0
      ? getBestCandidate(strictValidCandidates)
      : targetBucketCandidates.length > 0
        ? getBestCandidate(targetBucketCandidates)
        : fallbackCandidate;
}

export function createBallMotion({
  bucketIndex,
  layout = "regular",
  rows,
  seed,
}: BallSimulationParams): BallMotion {
  const motionSeed = seed ?? `${bucketIndex}:${rows}`;
  const cacheKey = getBallMotionCacheKey(layout, rows, bucketIndex, motionSeed);
  const cachedMotion = getCachedBallMotion(cacheKey);

  if (cachedMotion) {
    return cachedMotion;
  }

  const initialVelocityX = getSeededInitialVelocityX(bucketIndex, rows);
  const seedValue = getSeedValue(motionSeed);
  const velocityCacheKey = getInitialVelocityCacheKey(layout, rows, bucketIndex);
  const cachedInitialVelocityX = getCachedInitialVelocity(velocityCacheKey);

  if (cachedInitialVelocityX !== undefined) {
    const candidates = [
      ...getCandidateWindow(
        bucketIndex,
        layout,
        rows,
        seedValue,
        cachedInitialVelocityX,
        candidateVelocityStep,
        refinedCandidateVelocityStep,
      ),
      simulateBallMotion({
        bucketIndex,
        initialVelocityX,
        layout,
        rows,
        seedValue,
      }),
    ];
    const bestCandidate = getBestCandidate(candidates);
    const selectedCandidate = getSelectedCandidate(candidates, bestCandidate);
    const motion = applyTimingScale(
      selectedCandidate.motion,
      getRowsTimingScale(rows),
    );

    setCachedInitialVelocity(
      velocityCacheKey,
      selectedCandidate.initialVelocityX,
    );
    setCachedBallMotion(cacheKey, motion);

    return motion;
  }

  const candidates = [];

  for (
    let velocityX = minCandidateVelocityX;
    velocityX <= maxCandidateVelocityX;
    velocityX += candidateVelocityStep
  ) {
    candidates.push(
      simulateBallMotion({
        bucketIndex,
        initialVelocityX: velocityX,
        layout,
        rows,
        seedValue,
      }),
    );
  }

  candidates.push(
    simulateBallMotion({
      bucketIndex,
      initialVelocityX,
      layout,
      rows,
      seedValue,
    }),
  );

  const bestCandidate = getBestCandidate(candidates);
  const refinedCandidates = getCandidateWindow(
    bucketIndex,
    layout,
    rows,
    seedValue,
    bestCandidate.initialVelocityX,
    candidateVelocityStep,
    refinedCandidateVelocityStep,
  );

  const bestRefinedCandidate = getBestCandidate(refinedCandidates);
  const allCandidates = [...candidates, ...refinedCandidates];
  const selectedCandidate = getSelectedCandidate(
    allCandidates,
    bestRefinedCandidate,
  );

  const motion = applyTimingScale(
    selectedCandidate.motion,
    getRowsTimingScale(rows),
  );

  setCachedInitialVelocity(velocityCacheKey, selectedCandidate.initialVelocityX);
  setCachedBallMotion(cacheKey, motion);

  return motion;
}

function simulateBallMotion({
  bucketIndex,
  initialVelocityX,
  layout = "regular",
  rows,
  seedValue,
}: BallSimulationParams & { initialVelocityX: number; seedValue: number }) {
  const boardWidth = getBoardWidth(layout);
  const ballRadius = getBallRadius(rows, layout);
  const pegs = getPegs(rows, layout);
  const pyramidBounds = getPyramidBounds(rows, layout, ballRadius);
  const target = getTargetBucketGeometry(bucketIndex, rows, layout);
  const lastRowY = getPegPosition(Math.max(0, rows - 1), 0, rows, layout).y;
  const gravity = baseGravity * (0.96 + seedValue * 0.08);
  const initialVelocityY = 72 + seedValue * 34;
  const firstRowLeftPeg = getPegPosition(0, 0, rows, layout);
  const firstRowRightPeg = getPegPosition(0, 2, rows, layout);
  const pegRadius = getPegRadius(rows, layout);
  const firstRowSpan = firstRowRightPeg.x - firstRowLeftPeg.x;
  // Start the ball 2px above the first peg row, leaning the drop point toward
  // the target bucket's side (but kept within the three top pegs, plus a little
  // seeded variety). Starting nearer the target shortens the path and keeps the
  // ball off the containment rail, so even edge buckets can be reached by pegs
  // alone. The off-centre drop also makes the first contact a natural glancing
  // deflection instead of a dead-on trampoline off the centre peg.
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
  let exitX: number | null = null;
  let hasContacted = false;
  let touchedRail = false;
  let maxOutsidePyramidDistance = 0;
  let outsidePyramidFrameCount = 0;

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
    const outsidePyramidDistance = getOutsidePyramidDistance(
      position,
      pyramidBounds,
      ballRadius,
    );

    if (outsidePyramidDistance > 0) {
      maxOutsidePyramidDistance = Math.max(
        maxOutsidePyramidDistance,
        outsidePyramidDistance,
      );
      outsidePyramidFrameCount += 1;
    }

    // Side rails placed right on the outermost peg line, so on the rare path
    // that reaches the edge the bounce coincides with the visible pegs instead
    // of an invisible wall out in the empty margin. `getPyramidBounds` pads each
    // row by `ballRadius * 3`, so adding it back lands the rail exactly on the
    // outer peg line. Below the last row there is no bound: fall back to the
    // board walls for the bucket zone.
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

    if (exitX === null && position.y >= lastRowY) {
      exitX = position.x;
    }

    frames.push({
      ballPosition: { ...position },
      timeMs: elapsedMs,
    });

    if (position.y >= target.y) {
      break;
    }
  }

  const lastNaturalPosition =
    frames[frames.length - 1]?.ballPosition ?? position;
  const {
    isTargetBucketHit,
    score,
    staysInPyramid,
  } = calculateSimulationScore({
    ballRadius,
    exitX,
    impactEvents,
    initialVelocityX,
    lastNaturalPosition,
    maxOutsidePyramidDistance,
    outsidePyramidFrameCount,
    rows,
    target,
  });
  // A natural ball clatters down through roughly one peg per row. Trajectories
  // that reach the target with far fewer hits are tunnelling straight through
  // the field (very visible on 16 rows, where the pegs are small) — penalise
  // them heavily so the search never prefers a peg-skipping shortcut.
  settleMotionInTargetBucket(frames, target, ballRadius);

  const lastFrameTime = frames[frames.length - 1]?.timeMs ?? 0;
  const finalPosition = frames[frames.length - 1]?.ballPosition ?? position;

  return {
    initialVelocityX,
    isTargetBucketHit,
    staysInPyramid,
    touchedRail,
    motion: {
      durationMs: lastFrameTime,
      finalPosition,
      frames,
      impactEvents,
    },
    score,
  };
}
