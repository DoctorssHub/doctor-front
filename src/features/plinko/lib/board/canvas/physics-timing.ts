import {
  maxRowsForTimingScale,
  maxRowsTimingScale,
  minRowsForTimingScale,
} from "./physics-constants";
import { clamp } from "./physics-math";
import type { BallMotion } from "./physics-types";

export function getRowsTimingScale(rows: number) {
  const progress = clamp(
    (rows - minRowsForTimingScale) /
      (maxRowsForTimingScale - minRowsForTimingScale),
    0,
    1,
  );

  return 1 + progress * (maxRowsTimingScale - 1);
}

export function applyTimingScale(
  motion: BallMotion,
  scale: number,
): BallMotion {
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
