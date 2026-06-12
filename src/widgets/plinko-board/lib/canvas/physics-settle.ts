import {
  targetSettleDurationMs,
  targetSettleFrameCount,
} from "./physics-constants";
import {
  getBucketLandingPosition,
  isInsideTargetBucket,
} from "./physics-geometry";
import { easeOutCubic } from "./physics-math";
import type { BucketGeometry, SimulationFrame } from "./physics-types";

export function settleMotionInTargetBucket(
  frames: SimulationFrame[],
  target: BucketGeometry,
  ballRadius: number,
) {
  const lastFrame = frames[frames.length - 1];

  if (!lastFrame) {
    return;
  }

  if (isInsideTargetBucket(lastFrame.ballPosition, target, ballRadius)) {
    return;
  }

  const startPosition = lastFrame.ballPosition;
  const landingPosition = getBucketLandingPosition(
    startPosition,
    target,
    ballRadius,
  );

  for (let index = 1; index <= targetSettleFrameCount; index += 1) {
    const progress = easeOutCubic(index / targetSettleFrameCount);

    frames.push({
      ballPosition: {
        x:
          startPosition.x +
          (landingPosition.x - startPosition.x) * progress,
        y:
          startPosition.y +
          (landingPosition.y - startPosition.y) * progress,
      },
      timeMs:
        lastFrame.timeMs +
        (targetSettleDurationMs / targetSettleFrameCount) * index,
    });
  }
}
