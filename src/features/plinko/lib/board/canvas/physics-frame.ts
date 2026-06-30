import type { BallMotion, ImpactEvent, SimulationFrame } from "./physics-types";

const impactDurationMs = 170;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
    x:
      previous.ballPosition.x +
      (next.ballPosition.x - previous.ballPosition.x) * progress,
    y:
      previous.ballPosition.y +
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
