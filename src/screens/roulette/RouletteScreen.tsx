"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { getRouletteConfig, placeRouletteBet } from "@/features/roulette";
import {
  buildRouletteBetPayload,
  getPlacedBetsTotal,
} from "@/features/roulette/model/roulette-bets";
import { useRouletteStore } from "@/features/roulette/model/use-roulette-store";
import { BetControls } from "@/features/roulette/ui/BetControls";
import { BettingBoard } from "@/features/roulette/ui/BettingBoard";
import { RouletteResult } from "@/features/roulette/ui/RouletteResult";
import { RouletteWheel } from "@/features/roulette/ui/RouletteWheel";

function getGamePointsBalance(user: MeResponse | undefined) {
  const balance = user?.userBalances.find(
    (item) => item.balanceType === "GAME_POINTS",
  );

  return Number(balance?.value ?? 0);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Bet request failed";
}

export function RouletteScreen() {
  const queryClient = useQueryClient();
  const selectedChip = useRouletteStore((state) => state.selectedChip);
  const placedBets = useRouletteStore((state) => state.placedBets);
  const isSpinning = useRouletteStore((state) => state.isSpinning);
  const result = useRouletteStore((state) => state.result);
  const selectChip = useRouletteStore((state) => state.selectChip);
  const placeBet = useRouletteStore((state) => state.placeBet);
  const clearBets = useRouletteStore((state) => state.clearBets);
  const undoBet = useRouletteStore((state) => state.undoBet);
  const startSpin = useRouletteStore((state) => state.startSpin);
  const finishSpin = useRouletteStore((state) => state.finishSpin);
  const stopSpin = useRouletteStore((state) => state.stopSpin);

  const configQuery = useQuery({
    queryKey: ["roulette", "config"],
    queryFn: async () => (await getRouletteConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  const betMutation = useMutation({
    mutationFn: async () => {
      const payload = buildRouletteBetPayload(placedBets);

      return (await placeRouletteBet(payload)).data;
    },
    onMutate: () => {
      startSpin();
    },
    onError: () => {
      stopSpin();
    },
    onSuccess: async (response) => {
      finishSpin(response);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const totalBetAmount = getPlacedBetsTotal(placedBets);
  const gameBalance = getGamePointsBalance(meQuery.data);
  const minBet = configQuery.data?.minBet ?? 1;
  const maxBet = configQuery.data?.maxBet ?? 100000;
  const errorMessage = betMutation.error
    ? getErrorMessage(betMutation.error)
    : configQuery.error || meQuery.error
      ? "Unable to load game data"
      : null;

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-3 py-5 text-white md:px-5 md:py-7">
      <div className="mx-auto grid max-w-[1280px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_22px_80px_rgb(0_0_0_/_28%)] lg:grid-cols-[302px_minmax(0,1fr)]">
        <BetControls
          canUndo={placedBets.length > 0}
          errorMessage={errorMessage}
          gameBalance={gameBalance}
          isSpinning={isSpinning}
          isSubmitting={betMutation.isPending}
          maxBet={maxBet}
          minBet={minBet}
          onClear={clearBets}
          onSelectChip={selectChip}
          onSubmit={() => betMutation.mutate()}
          onUndo={undoBet}
          selectedChip={selectedChip}
          totalBetAmount={totalBetAmount}
        />

        <section className="flex min-w-0 flex-col justify-between gap-7 bg-[#07131d] p-4 md:p-6">
          <RouletteWheel
            isSpinning={isSpinning || betMutation.isPending}
            resultNumber={result?.number ?? null}
          />

          <div className="space-y-4">
            <BettingBoard
              disabled={isSpinning || betMutation.isPending}
              onPlaceBet={placeBet}
            />
            <RouletteResult result={result} />
          </div>
        </section>
      </div>
    </main>
  );
}
