"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import type { GameConfig } from "@/entities/game/model/types";
import type { ActiveRound } from "@/features/plinko/model/active-round";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { PlinkoBoard } from "@/features/plinko/ui/board/PlinkoBoard";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";

type PlinkoBoardPanelProps = {
  config: GameConfig;
  isFullscreen?: boolean;
  onRoundLanded?: (round: ActiveRound) => void;
};

export function PlinkoBoardPanel({
  config,
  isFullscreen = false,
  onRoundLanded,
}: PlinkoBoardPanelProps) {
  const {
    activeRounds,
    handleRoundAnimationComplete,
    recentMultipliers,
  } = usePlinkoRoundsStore(
    useShallow((state) => ({
      activeRounds: state.activeRounds,
      handleRoundAnimationComplete: state.handleRoundAnimationComplete,
      recentMultipliers: state.recentMultipliers,
    })),
  );
  const { risk, rows } = usePlinkoControlsStore(
    useShallow((state) => ({
      risk: state.risk,
      rows: state.rows,
    })),
  );
  const handleAnimationComplete = useCallback(
    (roundId: string) => {
      const completedRound = activeRounds.find((round) => round.id === roundId);
      const didWin =
        completedRound !== undefined && Number(completedRound.bet.payout) > 0;

      gameSounds.playResult({ didWin, lossSound: "pocket" });

      handleRoundAnimationComplete(roundId);

      if (completedRound) {
        onRoundLanded?.(completedRound);
      }
    },
    [activeRounds, handleRoundAnimationComplete, onRoundLanded],
  );

  return (
    <PlinkoBoard
      activeRounds={activeRounds}
      config={config}
      onRoundAnimationComplete={handleAnimationComplete}
      recentMultipliers={recentMultipliers}
      risk={risk}
      rows={rows}
      isFullscreen={isFullscreen}
    />
  );
}
