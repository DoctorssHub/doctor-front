"use client";

import { useCallback, useRef, useState } from "react";
import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";

type AddRoundParams = {
  bet: Bet;
  request: {
    mode: GameMode;
    risk: Risk;
    rows: number;
  };
};

export function usePlinkoRounds() {
  const [activeRounds, setActiveRounds] = useState<ActiveRound[]>([]);
  const [recentMultipliers, setRecentMultipliers] = useState([5.6, 0.5, 1]);
  const roundByIdRef = useRef(new Map<string, ActiveRound>());
  const historyRoundIdsRef = useRef(new Set<string>());

  const addRound = useCallback(({ bet, request }: AddRoundParams) => {
    const activeRound = {
      bet,
      id: bet.betId,
      isResultVisible: false,
      mode: request.mode,
      risk: request.risk,
      rows: request.rows,
    };

    roundByIdRef.current.set(activeRound.id, activeRound);
    setActiveRounds((currentRounds) => [...currentRounds, activeRound]);
  }, []);

  const handleRoundAnimationComplete = useCallback((roundId: string) => {
    const completedRound = roundByIdRef.current.get(roundId);

    if (completedRound && !historyRoundIdsRef.current.has(roundId)) {
      historyRoundIdsRef.current.add(roundId);
      setRecentMultipliers((currentMultipliers) => [
        completedRound.bet.multiplier,
        ...currentMultipliers,
      ]);
    }

    setActiveRounds((currentRounds) =>
      currentRounds.map((round) =>
        round.id === roundId ? { ...round, isResultVisible: true } : round,
      ),
    );

    window.setTimeout(() => {
      roundByIdRef.current.delete(roundId);
      setActiveRounds((currentRounds) =>
        currentRounds.filter((round) => round.id !== roundId),
      );
    }, 1200);
  }, []);

  return {
    activeRounds,
    addRound,
    handleRoundAnimationComplete,
    isRoundInFlight: activeRounds.length > 0,
    recentMultipliers,
  };
}
