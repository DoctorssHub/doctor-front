import type { ActiveRound } from "@/features/plinko/model/active-round";
import { type BallFrame } from "./drawing";
import { getBallFrame, type BallMotion } from "./physics";

export type BallFrameCollectionResult = {
  ballFrames: BallFrame[];
  shouldContinue: boolean;
};

type CollectBallFramesParams = {
  activeRounds: ActiveRound[];
  getRoundMotion: (roundId: string) => BallMotion | undefined;
  getRoundStartedAt: (roundId: string) => number | undefined;
  isRoundCompleted: (roundId: string) => boolean;
  markRoundCompleted: (roundId: string) => void;
  onRoundComplete: (roundId: string) => void;
  timestamp: number;
};

export function collectBallFrames({
  activeRounds,
  getRoundMotion,
  getRoundStartedAt,
  isRoundCompleted,
  markRoundCompleted,
  onRoundComplete,
  timestamp,
}: CollectBallFramesParams): BallFrameCollectionResult {
  const ballFrames: BallFrame[] = [];

  activeRounds.forEach((round) => {
    if (isRoundCompleted(round.id)) {
      return;
    }

    const ballMotion = getRoundMotion(round.id);

    if (!ballMotion) {
      return;
    }

    if (ballMotion.frames.length === 0) {
      markRoundCompleted(round.id);
      onRoundComplete(round.id);
      return;
    }

    const startedAt = getRoundStartedAt(round.id) ?? timestamp;
    const elapsedMs = timestamp - startedAt;
    const frame = getBallFrame(ballMotion, elapsedMs);

    ballFrames.push(frame);

    if (frame.isComplete) {
      markRoundCompleted(round.id);
      onRoundComplete(round.id);
    }
  });

  return {
    ballFrames,
    shouldContinue: ballFrames.length > 0,
  };
}
