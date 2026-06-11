import {
  type BallPosition,
  type BoardLayout,
  getBallRadius,
  getBoardHeight,
  getBoardWidth,
  getBucketLayout,
  getPegPosition,
  getPegRadius,
} from "@/widgets/plinko-board/lib/animation";

type Velocity = {
  x: number;
  y: number;
};

type Peg = BallPosition & {
  radius: number;
};

type PyramidBound = {
  left: number;
  right: number;
  y: number;
};

type BucketGeometry = BallPosition & {
  left: number;
  right: number;
};

type SimulationFrame = {
  ballPosition: BallPosition;
  timeMs: number;
};

type ImpactEvent = {
  position: BallPosition;
  timeMs: number;
};

export type BallMotion = {
  durationMs: number;
  finalPosition: BallPosition;
  frames: SimulationFrame[];
  impactEvents: ImpactEvent[];
};

type BallSimulationParams = {
  bucketIndex: number;
  layout?: BoardLayout;
  rows: number;
  seed?: string;
};

const fixedStepMs = 1000 / 120;
const maxDurationMs = 5200;
const baseGravity = 1850;
const restitution = 0.58;
const wallRestitution = 0.46;
const horizontalDamping = 0.992;
const verticalDamping = 0.998;
const impactDurationMs = 170;
const minCandidateVelocityX = -2200;
const maxCandidateVelocityX = 2200;
const candidateVelocityStep = 40;
const refinedCandidateVelocityStep = 8;
const minRowsForTimingScale = 8;
const maxRowsForTimingScale = 16;
const maxRowsTimingScale = 1.45;
const exitDriftWeight = 0.5;
const aimInertiaWeight = 0.03;
const motionCache = new Map<string, BallMotion>();

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getSeedValue(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash / 0xffffffff;
}

function getRowsTimingScale(rows: number) {
  const progress = clamp(
    (rows - minRowsForTimingScale) /
      (maxRowsForTimingScale - minRowsForTimingScale),
    0,
    1,
  );

  return 1 + progress * (maxRowsTimingScale - 1);
}

function applyTimingScale(motion: BallMotion, scale: number): BallMotion {
  if (scale === 1) {
    return motion;
  }

  return {
    ...motion,
    durationMs: motion.durationMs * scale,
    frames: motion.frames.map((frame) => ({
      ...frame,
      timeMs: frame.timeMs * scale,
    })),
    impactEvents: motion.impactEvents.map((impact) => ({
      ...impact,
      timeMs: impact.timeMs * scale,
    })),
  };
}

function getTargetBucketGeometry(
  bucketIndex: number,
  rows: number,
  layout: BoardLayout,
): BucketGeometry {
  const { bucketGap, bucketWidth, totalWidth } = getBucketLayout(rows, layout);
  const clampedBucketIndex = Math.min(rows, Math.max(0, bucketIndex));
  const firstBucketCenter =
    getBoardWidth(layout) / 2 - totalWidth / 2 + bucketWidth / 2;
  const x = firstBucketCenter + clampedBucketIndex * (bucketWidth + bucketGap);

  return {
    left: x - bucketWidth / 2,
    right: x + bucketWidth / 2,
    x,
    y: getBoardHeight(rows, layout) - 18,
  };
}

function getOutsideBucketDistance(x: number, bucket: BucketGeometry) {
  if (x < bucket.left) {
    return bucket.left - x;
  }

  if (x > bucket.right) {
    return x - bucket.right;
  }

  return 0;
}

function getSafeBucketBounds(bucket: BucketGeometry, ballRadius: number) {
  const padding = ballRadius * 0.35;

  return {
    left: bucket.left + padding,
    right: bucket.right - padding,
  };
}

function isInsideTargetBucket(
  position: BallPosition,
  bucket: BucketGeometry,
  ballRadius: number,
) {
  const safeBucket = getSafeBucketBounds(bucket, ballRadius);

  return position.x >= safeBucket.left && position.x <= safeBucket.right;
}

function getPegs(rows: number, layout: BoardLayout): Peg[] {
  const radius = getPegRadius(rows, layout);
  const pegs: Peg[] = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let pegIndex = 0; pegIndex < rowIndex + 3; pegIndex += 1) {
      pegs.push({
        ...getPegPosition(rowIndex, pegIndex, rows, layout),
        radius,
      });
    }
  }

  return pegs;
}

function getSeededInitialVelocityX(bucketIndex: number, rows: number) {
  const normalizedTarget = bucketIndex / Math.max(1, rows) - 0.5;
  const targetBias =
    Math.sign(normalizedTarget) *
    Math.pow(Math.abs(normalizedTarget), 0.72) *
    430;
  const deterministicJitter = ((bucketIndex * 37 + rows * 17) % 41) - 20;

  return targetBias + deterministicJitter;
}

function getPyramidBounds(
  rows: number,
  layout: BoardLayout,
  ballRadius: number,
) {
  const bounds: PyramidBound[] = [];
  const sidePadding = ballRadius * 3;

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const firstPeg = getPegPosition(rowIndex, 0, rows, layout);
    const lastPeg = getPegPosition(rowIndex, rowIndex + 2, rows, layout);

    bounds.push({
      left: firstPeg.x - sidePadding,
      right: lastPeg.x + sidePadding,
      y: firstPeg.y,
    });
  }

  return bounds;
}

function getInterpolatedPyramidBound(bounds: PyramidBound[], y: number) {
  if (bounds.length === 0) {
    return null;
  }

  const firstBound = bounds[0];
  const lastBound = bounds[bounds.length - 1];

  if (y < firstBound.y) {
    return firstBound;
  }

  if (y > lastBound.y) {
    return null;
  }

  const nextBoundIndex = bounds.findIndex((bound) => bound.y >= y);

  if (nextBoundIndex <= 0) {
    return firstBound;
  }

  const previousBound = bounds[nextBoundIndex - 1];
  const nextBound = bounds[nextBoundIndex];
  const progress = clamp(
    (y - previousBound.y) / (nextBound.y - previousBound.y),
    0,
    1,
  );

  return {
    left: previousBound.left + (nextBound.left - previousBound.left) * progress,
    right:
      previousBound.right + (nextBound.right - previousBound.right) * progress,
    y,
  };
}

function getOutsidePyramidDistance(
  position: BallPosition,
  bounds: PyramidBound[],
  ballRadius: number,
) {
  const bound = getInterpolatedPyramidBound(bounds, position.y);

  if (!bound) {
    return 0;
  }

  const left = bound.left + ballRadius;
  const right = bound.right - ballRadius;

  if (position.x < left) {
    return left - position.x;
  }

  if (position.x > right) {
    return position.x - right;
  }

  return 0;
}

function resolvePegCollision(
  position: BallPosition,
  velocity: Velocity,
  peg: Peg,
  ballRadius: number,
  collisionPosition = position,
) {
  const dx = collisionPosition.x - peg.x;
  const dy = collisionPosition.y - peg.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = ballRadius + peg.radius;

  if (distance >= minDistance) {
    return null;
  }

  const fallbackDistance = Math.hypot(velocity.x, velocity.y) || 1;
  const normalX = distance > 0 ? dx / distance : -velocity.x / fallbackDistance;
  const normalY = distance > 0 ? dy / distance : -velocity.y / fallbackDistance;
  const velocityAlongNormal = velocity.x * normalX + velocity.y * normalY;

  position.x = peg.x + normalX * minDistance;
  position.y = peg.y + normalY * minDistance;

  if (velocityAlongNormal < 0) {
    velocity.x -= (1 + restitution) * velocityAlongNormal * normalX;
    velocity.y -= (1 + restitution) * velocityAlongNormal * normalY;
  }

  velocity.x += normalX * 18;
  velocity.y += normalY * 18;

  return {
    x: peg.x,
    y: peg.y,
  };
}

function getClosestPointOnSegment(
  point: BallPosition,
  segmentStart: BallPosition,
  segmentEnd: BallPosition,
) {
  const segmentX = segmentEnd.x - segmentStart.x;
  const segmentY = segmentEnd.y - segmentStart.y;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (lengthSquared === 0) {
    return {
      point: segmentStart,
      progress: 0,
    };
  }

  const progress = clamp(
    ((point.x - segmentStart.x) * segmentX +
      (point.y - segmentStart.y) * segmentY) /
      lengthSquared,
    0,
    1,
  );

  return {
    point: {
      x: segmentStart.x + segmentX * progress,
      y: segmentStart.y + segmentY * progress,
    },
    progress,
  };
}

function getNearestCollidingPeg(
  previousPosition: BallPosition,
  position: BallPosition,
  velocity: Velocity,
  pegs: Peg[],
  ballRadius: number,
) {
  let nearestPeg: Peg | null = null;
  let nearestCollisionPosition: BallPosition | null = null;
  let nearestProgress = Number.POSITIVE_INFINITY;
  let nearestDistance = Number.POSITIVE_INFINITY;

  pegs.forEach((peg) => {
    const closest = getClosestPointOnSegment(peg, previousPosition, position);
    const dx = closest.point.x - peg.x;
    const dy = closest.point.y - peg.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = ballRadius + peg.radius;

    if (distance >= minDistance) {
      return;
    }

    const fallbackDistance = Math.hypot(velocity.x, velocity.y) || 1;
    const normalX =
      distance > 0 ? dx / distance : -velocity.x / fallbackDistance;
    const normalY =
      distance > 0 ? dy / distance : -velocity.y / fallbackDistance;
    const velocityAlongNormal = velocity.x * normalX + velocity.y * normalY;

    if (
      velocityAlongNormal >= 0 ||
      closest.progress > nearestProgress ||
      (closest.progress === nearestProgress && distance >= nearestDistance)
    ) {
      return;
    }

    nearestPeg = peg;
    nearestCollisionPosition = closest.point;
    nearestProgress = closest.progress;
    nearestDistance = distance;
  });

  if (!nearestPeg || !nearestCollisionPosition) {
    return null;
  }

  return {
    peg: nearestPeg,
    position: nearestCollisionPosition,
  };
}

function interpolateFrame(
  previous: SimulationFrame,
  next: SimulationFrame,
  elapsedMs: number,
) {
  const progress = clamp(
    (elapsedMs - previous.timeMs) / (next.timeMs - previous.timeMs),
    0,
    1,
  );

  return {
    x: previous.ballPosition.x +
      (next.ballPosition.x - previous.ballPosition.x) * progress,
    y: previous.ballPosition.y +
      (next.ballPosition.y - previous.ballPosition.y) * progress,
  };
}

function findFrameIndex(frames: SimulationFrame[], elapsedMs: number) {
  let low = 0;
  let high = frames.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    if (frames[middle].timeMs < elapsedMs) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low;
}

function getLatestImpact(impactEvents: ImpactEvent[], elapsedMs: number) {
  for (let index = impactEvents.length - 1; index >= 0; index -= 1) {
    const impact = impactEvents[index];

    if (impact.timeMs <= elapsedMs) {
      return impact;
    }
  }

  return null;
}

function getBestCandidate<T extends { score: number }>(candidates: T[]) {
  return candidates.reduce((best, candidate) =>
    candidate.score < best.score ? candidate : best,
  );
}

export function createBallMotion({
  bucketIndex,
  layout = "regular",
  rows,
  seed,
}: BallSimulationParams): BallMotion {
  const cacheKey = `${layout}:${rows}:${bucketIndex}`;
  const cachedMotion = motionCache.get(cacheKey);

  if (cachedMotion) {
    return cachedMotion;
  }

  const initialVelocityX = getSeededInitialVelocityX(bucketIndex, rows);
  const seedValue = getSeedValue(seed ?? `${bucketIndex}:${rows}`);
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
  const refinedCandidates = [];

  for (
    let velocityX = bestCandidate.initialVelocityX - candidateVelocityStep;
    velocityX <= bestCandidate.initialVelocityX + candidateVelocityStep;
    velocityX += refinedCandidateVelocityStep
  ) {
    refinedCandidates.push(
      simulateBallMotion({
        bucketIndex,
        initialVelocityX: velocityX,
        layout,
        rows,
        seedValue,
      }),
    );
  }

  const bestRefinedCandidate = getBestCandidate(refinedCandidates);
  const allCandidates = [...candidates, ...refinedCandidates];
  // Best of all worlds: the ball reaches the target while only ever bouncing
  // off pegs (never the containment rail). Fall back progressively if no such
  // trajectory exists for this bucket.
  const railFreeCandidates = allCandidates.filter(
    (candidate) => candidate.isTargetBucketHit && !candidate.touchedRail,
  );
  const strictValidCandidates = allCandidates.filter(
    (candidate) => candidate.isTargetBucketHit && candidate.staysInPyramid,
  );
  const targetBucketCandidates = allCandidates.filter(
    (candidate) => candidate.isTargetBucketHit,
  );
  const selectedCandidate =
    railFreeCandidates.length > 0
      ? getBestCandidate(railFreeCandidates)
      : strictValidCandidates.length > 0
        ? getBestCandidate(strictValidCandidates)
        : targetBucketCandidates.length > 0
          ? getBestCandidate(targetBucketCandidates)
          : bestRefinedCandidate;

  const motion = applyTimingScale(
    selectedCandidate.motion,
    getRowsTimingScale(rows),
  );

  motionCache.set(cacheKey, motion);

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

  const lastFrameTime = frames[frames.length - 1]?.timeMs ?? 0;
  const lastNaturalPosition =
    frames[frames.length - 1]?.ballPosition ?? position;
  const xDistance = Math.abs(lastNaturalPosition.x - target.x);
  const yShortfall = Math.max(0, target.y - lastNaturalPosition.y);
  const outsideTargetBucketDistance = getOutsideBucketDistance(
    lastNaturalPosition.x,
    target,
  );
  const isTargetBucketHit =
    yShortfall <= ballRadius * 0.5 &&
    isInsideTargetBucket(lastNaturalPosition, target, ballRadius);
  const staysInPyramid =
    maxOutsidePyramidDistance <= ballRadius * 0.5 &&
    outsidePyramidFrameCount <= 2;
  const impactPenalty = impactEvents.length === 0 ? 400 : 0;
  // A natural ball clatters down through roughly one peg per row. Trajectories
  // that reach the target with far fewer hits are tunnelling straight through
  // the field (very visible on 16 rows, where the pegs are small) — penalise
  // them heavily so the search never prefers a peg-skipping shortcut.
  const minExpectedImpacts = Math.max(3, Math.round(rows * 0.4));
  const sparseImpactPenalty =
    impactEvents.length < minExpectedImpacts
      ? (minExpectedImpacts - impactEvents.length) * 240
      : 0;
  const outsideBucketPenalty =
    xDistance > ballRadius * 2
      ? Math.pow(xDistance - ballRadius * 2, 1.12)
      : 0;
  const outsidePyramidPenalty =
    maxOutsidePyramidDistance * 140 + outsidePyramidFrameCount * 10;
  const wrongBucketPenalty =
    !isTargetBucketHit
      ? 50000 + outsideTargetBucketDistance * 1200 + xDistance * 120
      : 0;
  const earlyFinishPenalty =
    yShortfall > ballRadius * 0.5 ? 6000 + yShortfall * 120 : 0;
  // How far the ball is from the target bucket when it leaves the last peg row.
  // Penalising this makes the ball commit to the correct gap while still among
  // the pegs, so the final drop is short and vertical instead of sliding side-
  // ways over a nearer bucket's divider into a farther one.
  const exitDrift = Math.abs((exitX ?? lastNaturalPosition.x) - target.x);
  const exitDriftPenalty = exitDrift * exitDriftWeight;
  // Prefer the calmest aim that still reaches the target: a smaller initial
  // horizontal velocity means less sideways inertia released at the first peg.
  const aimInertiaPenalty = Math.abs(initialVelocityX) * aimInertiaWeight;
  const targetAlignmentScore =
    outsideTargetBucketDistance > 0 ? xDistance : xDistance * 0.12;

  return {
    initialVelocityX,
    isTargetBucketHit,
    staysInPyramid,
    touchedRail,
    motion: {
      durationMs: lastFrameTime,
      finalPosition: lastNaturalPosition,
      frames,
      impactEvents,
    },
    score:
      targetAlignmentScore +
      outsideBucketPenalty +
      wrongBucketPenalty +
      outsidePyramidPenalty +
      yShortfall * 2 +
      earlyFinishPenalty +
      impactPenalty +
      sparseImpactPenalty +
      exitDriftPenalty +
      aimInertiaPenalty,
  };
}

export function getBallFrame(motion: BallMotion, elapsedMs: number) {
  if (motion.frames.length === 0) {
    return {
      impactProgress: 1,
      isComplete: true,
    };
  }

  if (elapsedMs >= motion.durationMs) {
    return {
      ballPosition: motion.finalPosition,
      impactProgress: 1,
      isComplete: true,
    };
  }

  const nextFrameIndex = findFrameIndex(motion.frames, elapsedMs);
  const nextFrame = motion.frames[nextFrameIndex] ?? motion.frames[0];
  const previousFrame = motion.frames[Math.max(0, nextFrameIndex - 1)];
  const impact = getLatestImpact(motion.impactEvents, elapsedMs);
  const impactElapsedMs = impact ? elapsedMs - impact.timeMs : impactDurationMs;
  const impactProgress =
    impact && impactElapsedMs < impactDurationMs
      ? easeOutCubic(impactElapsedMs / impactDurationMs)
      : 1;

  return {
    ballPosition:
      previousFrame === nextFrame
        ? nextFrame.ballPosition
        : interpolateFrame(previousFrame, nextFrame, elapsedMs),
    impactPosition: impactProgress < 1 ? impact?.position : undefined,
    impactProgress,
    isComplete: false,
  };
}
