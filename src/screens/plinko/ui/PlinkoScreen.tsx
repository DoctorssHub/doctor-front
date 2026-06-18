"use client";

import { useEffect } from "react";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
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
          "mx-auto bg-[#080c17] shadow-[0_24px_80px_rgb(0_0_0/28%)] transition-[max-width] duration-300 ease-out",
          isFullscreen
            ? "flex h-screen max-w-none flex-col overflow-hidden"
            : "max-w-240",
        ].join(" ")}
      >
        <section
          className={[
            "flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-[#111827] bg-[#0c111d] laptop:flex-row max-laptop:min-h-0",
            isFullscreen ? "min-h-0 flex-1 rounded-none" : "min-h-131",
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
    </main>
  );
}
