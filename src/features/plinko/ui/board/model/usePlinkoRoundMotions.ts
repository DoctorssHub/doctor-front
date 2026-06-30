"use client";

import { useCallback, useEffect, useRef } from "react";
import type { BoardLayout } from "@/features/plinko/lib/board/animation";
import {
  createBallMotion,
  type BallMotion,
} from "@/features/plinko/lib/board/canvas/physics";
import type { ActiveRound } from "@/features/plinko/model/active-round";

type UsePlinkoRoundMotionsParams = {
  activeRounds: ActiveRound[];
  layout: BoardLayout;
  rows: number;
};

export function usePlinkoRoundMotions({
  activeRounds,
  layout,
  rows,
}: UsePlinkoRoundMotionsParams) {
  const activeRoundsRef = useRef(activeRounds);
  const startedAtByRoundRef = useRef(new Map<string, number>());
  const ballMotionByRoundRef = useRef(new Map<string, BallMotion>());
  const boardKeyRef = useRef(`${layout}:${rows}`);
  const completedRoundIdsRef = useRef(new Set<string>());

  useEffect(() => {
    activeRoundsRef.current = activeRounds;
  }, [activeRounds]);

  const syncActiveRoundMotions = useCallback(
    (resetStartedAt = false) => {
      const activeRoundIds = new Set(
        activeRoundsRef.current.map((round) => round.id),
      );

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

      activeRoundsRef.current.forEach((round) => {
        if (completedRoundIdsRef.current.has(round.id)) {
          return;
        }

        if (!resetStartedAt && ballMotionByRoundRef.current.has(round.id)) {
          return;
        }

        const ballMotion = createBallMotion({
          bucketIndex: round.bet.bucketIndex,
          layout,
          rows,
          seed: round.bet.betId,
        });

        ballMotionByRoundRef.current.set(round.id, ballMotion);

        if (resetStartedAt || !startedAtByRoundRef.current.has(round.id)) {
          startedAtByRoundRef.current.set(round.id, performance.now());
        }
      });
    },
    [layout, rows],
  );

  useEffect(() => {
    syncActiveRoundMotions();
  }, [activeRounds, syncActiveRoundMotions]);

  const rebuildActiveRoundMotions = useCallback(() => {
    ballMotionByRoundRef.current.clear();
    syncActiveRoundMotions(true);
  }, [syncActiveRoundMotions]);

  useEffect(() => {
    const nextBoardKey = `${layout}:${rows}`;

    if (boardKeyRef.current === nextBoardKey) {
      return;
    }

    boardKeyRef.current = nextBoardKey;
    rebuildActiveRoundMotions();
  }, [layout, rebuildActiveRoundMotions, rows]);

  const getRoundMotion = useCallback((roundId: string) => {
    return ballMotionByRoundRef.current.get(roundId);
  }, []);

  const getRoundStartedAt = useCallback((roundId: string) => {
    return startedAtByRoundRef.current.get(roundId);
  }, []);

  const hasPendingRound = useCallback(() => {
    return activeRoundsRef.current.some(
      (round) => !completedRoundIdsRef.current.has(round.id),
    );
  }, []);

  const isRoundCompleted = useCallback((roundId: string) => {
    return completedRoundIdsRef.current.has(roundId);
  }, []);

  const markRoundCompleted = useCallback((roundId: string) => {
    completedRoundIdsRef.current.add(roundId);
  }, []);

  return {
    activeRoundsRef,
    getRoundMotion,
    getRoundStartedAt,
    hasPendingRound,
    isRoundCompleted,
    markRoundCompleted,
  };
}
