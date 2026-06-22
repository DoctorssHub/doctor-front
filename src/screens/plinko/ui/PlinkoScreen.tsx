"use client";

import { useEffect } from "react";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { BetHistoryTable } from "@/widgets/bet-history";
import { ProvablyFairBar } from "@/features/provably-fair";
import { useGameFullscreen } from "@/features/provably-fair/model/use-game-fullscreen";
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
  const { fullscreenRef, isFullscreen, toggleFullscreen } = useGameFullscreen();

  useEffect(() => {
    return () => {
      resetBetting();
      resetControls();
      resetRounds();
    };
  }, [resetBetting, resetControls, resetRounds]);

  return (
    <main className="bg-[#080c17] p-4 text-white max-tablet:p-2 tablet:p-5">
      <div
        ref={fullscreenRef}
        className={[
          "game-fullscreen-root game-page-shell-in mx-auto bg-[#080c17] shadow-[0_24px_80px_rgb(0_0_0/28%)] transition-[max-width] duration-300 ease-out",
          isFullscreen
            ? "flex h-screen max-w-none flex-col overflow-x-hidden overflow-y-auto"
            : "max-w-[1017px]",
        ].join(" ")}
      >
        <section
          className={[
            "flex flex-col rounded-t-xl border border-b-0 border-[#111827] bg-[#0c111d] laptop:flex-row max-laptop:min-h-0",
            isFullscreen
              ? "min-h-[668px] flex-1 shrink-0 overflow-visible rounded-none"
              : "min-h-131 overflow-hidden laptop:h-[668px]",
          ].join(" ")}
        >
          <PlinkoSidebar
            configErrorMessage={configErrorMessage}
            hasGameConfigError={hasGameConfigError}
            isGameConfigLoading={isGameConfigLoading}
            isGameConfigReady={isGameConfigReady}
            maxBet={plinkoConfig.maxBet}
            minBet={plinkoConfig.minBet}
          />
          <PlinkoBoardPanel config={plinkoConfig} isFullscreen={isFullscreen} />
        </section>
        <ProvablyFairBar
          game="plinko"
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
      <BetHistoryTable
        className="game-page-table-in mx-auto mt-8 w-full max-w-[1017px]"
        game="plinko"
        variant="game-live"
      />
    </main>
  );
}
