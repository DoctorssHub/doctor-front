"use client";

import { memo, useCallback, useRef } from "react";
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
  const boardHeight = getBoardHeight(rows, layout);
  const boardWidth = getBoardWidth(layout);
  const pixelRatio = useDevicePixelRatio();
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
  });

  const drawFrame = useCallback(
    (timestamp: number) => {
      const ballContext = ballContextRef.current;

      if (!ballContext) {
        return "stop";
      }

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
