import type { BoardLayout } from "@/features/plinko/lib/board/animation";
import {
  getBallMotionCacheKey,
  getCachedBallMotion,
  setCachedBallMotion,
} from "./physics-cache";
import {
  SEED_COUNT,
  VX_MIN,
  VX_STEP,
  plinkoLandingTable,
} from "./physics-landing-table.generated";
import { getSeedValue } from "./physics-math";
import { simulateBallMotion } from "./physics-simulate";
import { applyTimingScale, getRowsTimingScale } from "./physics-timing";
import type { BallMotion, BallSimulationParams } from "./physics-types";

export type { BallMotion } from "./physics-types";
export { getBallFrame } from "./physics-frame";

// Boards already reported as stale, so the safety-guard warning is logged once
// per board instead of on every drop (avoids flooding the console in production).
const loggedStaleBoards = new Set<string>();

// The backend dictates the bucket. We never correct the ball into it; instead a
// precomputed table (see physics-landing-table.generated.ts) holds, per board,
// the initial conditions whose live physics NATURALLY land inside the target
// bucket. The round's seed picks one of them, so each drop is honest and varied.
function getLandingParams(
  layout: BoardLayout,
  rows: number,
  bucketIndex: number,
  motionSeed: string,
) {
  const clampedBucket = Math.min(rows, Math.max(0, bucketIndex));
  const pairs = plinkoLandingTable[layout]?.[`${rows}:${clampedBucket}`];

  if (!pairs || pairs.length === 0) {
    // Offline verification proved every board reaches every bucket, so this is
    // a safety net only. The simulation's correctOnMiss guard still steers the
    // ball into the right bucket, so the payout can never be misrepresented.
    return { initialVelocityX: 0, seedValue: 0.5 };
  }

  const count = pairs.length / 2;
  const index = Math.min(
    count - 1,
    Math.floor(getSeedValue(`${motionSeed}:pick`) * count),
  );

  return {
    initialVelocityX: VX_MIN + pairs[index * 2] * VX_STEP,
    seedValue: (pairs[index * 2 + 1] + 0.5) / SEED_COUNT,
  };
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

  const { initialVelocityX, seedValue } = getLandingParams(
    layout,
    rows,
    bucketIndex,
    motionSeed,
  );
  // correctOnMiss guarantees the shown bucket matches the backend even if the
  // table is ever stale; in normal operation the landing is natural and the
  // guard does nothing.
  const { isTargetBucketHit, motion } = simulateBallMotion({
    bucketIndex,
    correctOnMiss: true,
    initialVelocityX,
    layout,
    rows,
    seedValue,
  });

  const staleKey = `${layout}:${rows}:${bucketIndex}`;

  if (!isTargetBucketHit && !loggedStaleBoards.has(staleKey)) {
    loggedStaleBoards.add(staleKey);
    console.error(
      `[plinko] landing table is stale for ${staleKey} — the ball did not land naturally and was corrected into the bucket. The table must be regenerated for the current physics/geometry.`,
    );
  }

  const scaledMotion = applyTimingScale(motion, getRowsTimingScale(rows));

  setCachedBallMotion(cacheKey, scaledMotion);

  return scaledMotion;
}
