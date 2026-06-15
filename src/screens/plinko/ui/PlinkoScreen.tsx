"use client";

import { useEffect } from "react";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { usePlinkoConfig } from "../model/usePlinkoConfig";
import { PlinkoBoardPanel } from "./PlinkoBoardPanel";
import { PlinkoSidebar } from "./PlinkoSidebar";

export function PlinkoScreen() {
  const {
    config: plinkoConfig,
    errorMessage: configErrorMessage,
    hasError: hasGameConfigError,
    isLoading: isGameConfigLoading,
    isReady: isGameConfigReady,
  } = usePlinkoConfig();
  const resetBetting = usePlinkoBettingStore((state) => state.resetBetting);
  const resetControls = usePlinkoControlsStore((state) => state.resetControls);
  const resetRounds = usePlinkoRoundsStore((state) => state.resetRounds);

  useEffect(() => {
    return () => {
      resetBetting();
      resetControls();
      resetRounds();
    };
  }, [resetBetting, resetControls, resetRounds]);

  return (
    <main className="bg-[#080c17] p-4 text-white max-tablet:p-2 tablet:p-5">
      <section className="mx-auto flex min-h-131 max-w-240 flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0/28%)] laptop:flex-row max-laptop:min-h-0">
        <PlinkoSidebar
          configErrorMessage={configErrorMessage}
          hasGameConfigError={hasGameConfigError}
          isGameConfigLoading={isGameConfigLoading}
          isGameConfigReady={isGameConfigReady}
          maxBet={plinkoConfig.maxBet}
          minBet={plinkoConfig.minBet}
        />
        <PlinkoBoardPanel config={plinkoConfig} />
      </section>
    </main>
  );
}
