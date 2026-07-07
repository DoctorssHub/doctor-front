"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { getPlinkoTurboTimingScale } from "@/shared/lib/turbo-mode";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { useDevicePixelRatio } from "@/shared/lib/useDevicePixelRatio";
import type { ActiveRound } from "@/features/plinko/model/active-round";
import {
  type BoardLayout,
  getBoardHeight,
  getBoardWidth,
} from "@/features/plinko/lib/board/animation";
import { collectBallFrames } from "@/features/plinko/lib/board/canvas/ball-frames";
import {
  drawBallLayer,
  drawPegLayer,
} from "@/features/plinko/lib/board/canvas/drawing";
import { useConfiguredCanvas } from "@/features/plinko/lib/board/canvas/useConfiguredCanvas";
import { useAnimationFrameLoop } from "@/features/plinko/ui/board/model/useAnimationFrameLoop";
import { usePlinkoRoundMotions } from "@/features/plinko/ui/board/model/usePlinkoRoundMotions";

type PlinkoCanvasProps = {
  activeRounds: ActiveRound[];
  layout?: BoardLayout;
  onAnimationComplete: (roundId: string) => void;
  rows: number;
};

export const PlinkoCanvas = memo(function PlinkoCanvas({
  activeRounds,
  layout = "regular",
  onAnimationComplete,
  rows,
}: PlinkoCanvasProps) {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const playedImpactIndexByRoundRef = useRef(new Map<string, number>());
  const boardHeight = getBoardHeight(rows, layout);
  const boardWidth = getBoardWidth(layout);
  const pixelRatio = useDevicePixelRatio();
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const timingScale = getPlinkoTurboTimingScale(isTurboModeEnabled);
  const {
    activeRoundsRef,
    getRoundMotion,
    getRoundStartedAt,
    hasPendingRound,
    isRoundCompleted,
    markRoundCompleted,
  } = usePlinkoRoundMotions({
    activeRounds,
    layout,
    rows,
    timingScale,
  });

  useEffect(() => {
    const activeRoundIds = new Set(activeRounds.map((round) => round.id));

    playedImpactIndexByRoundRef.current.forEach((_, roundId) => {
      if (!activeRoundIds.has(roundId)) {
        playedImpactIndexByRoundRef.current.delete(roundId);
      }
    });
  }, [activeRounds]);

  const playPendingPegImpactSounds = useCallback(
    (timestamp: number) => {
      activeRoundsRef.current.forEach((round) => {
        if (isRoundCompleted(round.id)) {
          return;
        }

        const ballMotion = getRoundMotion(round.id);
        const startedAt = getRoundStartedAt(round.id);

        if (!ballMotion || startedAt === undefined) {
          return;
        }

        const elapsedMs = timestamp - startedAt;
        let nextImpactIndex = playedImpactIndexByRoundRef.current.get(round.id) ?? 0;

        while (
          nextImpactIndex < ballMotion.impactEvents.length &&
          ballMotion.impactEvents[nextImpactIndex].timeMs <= elapsedMs
        ) {
          gameSounds.playImpact();
          nextImpactIndex += 1;
        }

        playedImpactIndexByRoundRef.current.set(round.id, nextImpactIndex);
      });
    },
    [activeRoundsRef, getRoundMotion, getRoundStartedAt, isRoundCompleted],
  );

  const drawFrame = useCallback(
    (timestamp: number) => {
      const ballContext = ballContextRef.current;

      if (!ballContext) {
        return "stop";
      }

      playPendingPegImpactSounds(timestamp);

      const { ballFrames, shouldContinue } = collectBallFrames({
        activeRounds: activeRoundsRef.current,
        getRoundMotion,
        getRoundStartedAt,
        isRoundCompleted,
        markRoundCompleted,
        onRoundComplete: onAnimationComplete,
        timestamp,
      });

      drawBallLayer(ballContext, {
        ballFrames,
        height: boardHeight,
        layout,
        pixelRatio,
        rows,
        width: boardWidth,
      });

      return shouldContinue ? "continue" : "stop";
    },
    [
      activeRoundsRef,
      boardHeight,
      boardWidth,
      getRoundMotion,
      getRoundStartedAt,
      isRoundCompleted,
      layout,
      markRoundCompleted,
      onAnimationComplete,
      playPendingPegImpactSounds,
      pixelRatio,
      rows,
    ],
  );
  const { startLoopIfNeeded, stopLoop } = useAnimationFrameLoop({
    hasPendingFrame: hasPendingRound,
    onFrame: drawFrame,
    startSignal: activeRounds,
  });

  const handleStaticCanvasConfigured = useCallback(
    (context: CanvasRenderingContext2D) => {
      drawPegLayer(context, {
        height: boardHeight,
        layout,
        rows,
        width: boardWidth,
      });
    },
    [boardHeight, boardWidth, layout, rows],
  );

  const handleBallCanvasConfigured = useCallback(
    (context: CanvasRenderingContext2D) => {
      ballContextRef.current = context;
      startLoopIfNeeded();
    },
    [startLoopIfNeeded],
  );

  const handleBallCanvasCleanup = useCallback(() => {
    ballContextRef.current = null;
    stopLoop();
  }, [stopLoop]);

  useConfiguredCanvas({
    height: boardHeight,
    onConfigured: handleStaticCanvasConfigured,
    pixelRatio,
    ref: staticCanvasRef,
    width: boardWidth,
  });

  useConfiguredCanvas({
    height: boardHeight,
    onCleanup: handleBallCanvasCleanup,
    onConfigured: handleBallCanvasConfigured,
    pixelRatio,
    ref: ballCanvasRef,
    width: boardWidth,
  });

  return (
    <>
      <canvas
        aria-label="Plinko board"
        className="absolute left-1/2 top-0 -translate-x-1/2"
        height={boardHeight}
        ref={staticCanvasRef}
        width={boardWidth}
      />
      <canvas
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        height={boardHeight}
        ref={ballCanvasRef}
        width={boardWidth}
      />
    </>
  );
});
