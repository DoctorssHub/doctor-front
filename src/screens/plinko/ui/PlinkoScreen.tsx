"use client";

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  creditGamePointsBalanceToAuthSession,
  creditGamePointsBalanceToMeResponse,
} from "@/features/auth";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { usePlinkoConfig } from "@/features/plinko/model/usePlinkoConfig";
import type { ActiveRound } from "@/features/plinko/model/active-round";
import { PlinkoBoardPanel, PlinkoSidebar } from "@/features/plinko/ui";
import { ProvablyFairBar } from "@/features/provably-fair";
import { GameFullscreenShell } from "@/shared";
import { BetHistoryTable } from "@/widgets/bet-history";

export function PlinkoScreen() {
  const queryClient = useQueryClient();
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

  const handleRoundLanded = useCallback((round: ActiveRound) => {
    const creditedUser = creditGamePointsBalanceToMeResponse(
      queryClient.getQueryData<MeResponse>(["me"]),
      round.bet.payout,
    );

    queryClient.setQueryData<MeResponse | undefined>(["me"], creditedUser);
    creditGamePointsBalanceToAuthSession(round.bet.payout);
  }, [queryClient]);

  useEffect(() => {
    return () => {
      resetBetting();
      resetControls();
      resetRounds();
    };
  }, [resetBetting, resetControls, resetRounds]);

  return (
    <main className="bg-[#080c17] p-4 text-white max-tablet:p-2 tablet:p-5">
      <GameFullscreenShell
        className="game-fullscreen-root game-page-shell-in mx-auto bg-[#080c17] shadow-[0_24px_80px_rgb(0_0_0/28%)] transition-[max-width] duration-300 ease-out"
        controls={({ isFullscreen, onToggleFullscreen }) => (
          <ProvablyFairBar
            game="plinko"
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      >
        {({ isFullscreen }) => (
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
            <PlinkoBoardPanel
              config={plinkoConfig}
              isFullscreen={isFullscreen}
              onRoundLanded={handleRoundLanded}
            />
          </section>
        )}
      </GameFullscreenShell>
      <BetHistoryTable
        className="game-page-table-in mx-auto mt-8 w-full max-w-[1017px]"
        game="plinko"
        variant="game-live"
      />
    </main>
  );
}
