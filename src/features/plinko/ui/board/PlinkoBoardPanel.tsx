"use client";

import { useShallow } from "zustand/react/shallow";
import type { GameConfig } from "@/entities/game/model/types";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { PlinkoBoard } from "@/features/plinko/ui/board/PlinkoBoard";

type PlinkoBoardPanelProps = {
  config: GameConfig;
  isFullscreen?: boolean;
};

export function PlinkoBoardPanel({
  config,
  isFullscreen = false,
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

  return (
    <PlinkoBoard
      activeRounds={activeRounds}
      config={config}
      onRoundAnimationComplete={handleRoundAnimationComplete}
      recentMultipliers={recentMultipliers}
      risk={risk}
      rows={rows}
      isFullscreen={isFullscreen}
    />
  );
}
