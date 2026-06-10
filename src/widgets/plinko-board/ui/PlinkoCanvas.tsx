"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";
import {
  type BoardLayout,
  getBoardHeight,
  getBoardWidth,
} from "@/widgets/plinko-board/lib/animation";
import {
  configureCanvas,
  type BallFrame,
  drawBallLayer,
  drawPegLayer,
} from "@/widgets/plinko-board/lib/canvas/drawing";
import {
  createBallMotion,
  getBallFrame,
  type BallMotion,
} from "@/widgets/plinko-board/lib/canvas/physics";

type PlinkoCanvasProps = {
  activeRounds: ActiveRound[];
  layout?: BoardLayout;
  onAnimationComplete: (roundId: string) => void;
  rows: number;
};

export function PlinkoCanvas({
  activeRounds,
  layout = "regular",
  onAnimationComplete,
  rows,
}: PlinkoCanvasProps) {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const activeRoundsRef = useRef(activeRounds);
  const startedAtByRoundRef = useRef(new Map<string, number>());
  const ballMotionByRoundRef = useRef(new Map<string, BallMotion>());
  const completedRoundIdsRef = useRef(new Set<string>());
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const animationFrameRef = useRef(0);
  const isLoopRunningRef = useRef(false);
  const runFrameRef = useRef<(timestamp: number) => void>(() => {});
  const boardHeight = getBoardHeight(rows, layout);
  const boardWidth = getBoardWidth(layout);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    activeRoundsRef.current = activeRounds;
  }, [activeRounds]);

  useEffect(() => {
    const activeRoundIds = new Set(activeRounds.map((round) => round.id));

    startedAtByRoundRef.current.forEach((_, roundId) => {
      if (!activeRoundIds.has(roundId)) {
        startedAtByRoundRef.current.delete(roundId);
      }
    });

    ballMotionByRoundRef.current.forEach((_, roundId) => {
      if (!activeRoundIds.has(roundId)) {
        ballMotionByRoundRef.current.delete(roundId);
      }
    });

    completedRoundIdsRef.current.forEach((roundId) => {
      if (!activeRoundIds.has(roundId)) {
        completedRoundIdsRef.current.delete(roundId);
      }
    });
  }, [activeRounds]);

  const runFrame = useCallback(
    (timestamp: number) => {
      const ballContext = ballContextRef.current;

      if (!ballContext) {
        isLoopRunningRef.current = false;
        return;
      }

      const ballFrames: BallFrame[] = [];

      activeRoundsRef.current.forEach((round) => {
        if (completedRoundIdsRef.current.has(round.id)) {
          return;
        }

        let ballMotion = ballMotionByRoundRef.current.get(round.id);

        if (!ballMotion) {
          ballMotion = createBallMotion({
            bucketIndex: round.bet.bucketIndex,
            layout,
            rows,
            seed: round.bet.betId,
          });
          ballMotionByRoundRef.current.set(round.id, ballMotion);
        }

        if (ballMotion.frames.length === 0) {
          completedRoundIdsRef.current.add(round.id);
          onAnimationCompleteRef.current(round.id);
          return;
        }

        if (!startedAtByRoundRef.current.has(round.id)) {
          startedAtByRoundRef.current.set(round.id, timestamp);
        }

        const startedAt =
          startedAtByRoundRef.current.get(round.id) ?? timestamp;
        const elapsedMs = timestamp - startedAt;
        const frame = getBallFrame(ballMotion, elapsedMs);

        ballFrames.push(frame);

        if (frame.isComplete) {
          completedRoundIdsRef.current.add(round.id);
          onAnimationCompleteRef.current(round.id);
        }
      });

      drawBallLayer(ballContext, {
        ballFrames,
        height: boardHeight,
        layout,
        rows,
        width: boardWidth,
      });

      if (ballFrames.length === 0) {
        isLoopRunningRef.current = false;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(
        runFrameRef.current,
      );
    },
    [boardHeight, boardWidth, layout, rows],
  );

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  const startLoopIfNeeded = useCallback(() => {
    if (isLoopRunningRef.current) {
      return;
    }

    const hasPendingRound = activeRoundsRef.current.some(
      (round) => !completedRoundIdsRef.current.has(round.id),
    );

    if (!hasPendingRound) {
      return;
    }

    isLoopRunningRef.current = true;
    animationFrameRef.current = window.requestAnimationFrame(
      runFrameRef.current,
    );
  }, []);

  useEffect(() => {
    const canvas = staticCanvasRef.current;

    if (!canvas) {
      return;
    }

    const context = configureCanvas(canvas, {
      height: boardHeight,
      width: boardWidth,
    });

    if (!context) {
      return;
    }

    ballMotionByRoundRef.current.clear();

    drawPegLayer(context, {
      height: boardHeight,
      layout,
      rows,
      width: boardWidth,
    });
  }, [boardHeight, boardWidth, layout, rows]);

  useEffect(() => {
    const canvas = ballCanvasRef.current;

    if (!canvas) {
      return;
    }

    const context = configureCanvas(canvas, {
      height: boardHeight,
      width: boardWidth,
    });

    if (!context) {
      return;
    }

    ballContextRef.current = context;
    startLoopIfNeeded();

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      isLoopRunningRef.current = false;
    };
  }, [boardHeight, boardWidth, layout, rows, startLoopIfNeeded]);

  useEffect(() => {
    startLoopIfNeeded();
  }, [activeRounds, startLoopIfNeeded]);

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
}
