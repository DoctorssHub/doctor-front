"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  getRouletteConfig,
  placeRouletteBet,
  type RouletteBetRequest,
} from "@/features/roulette";
import {
  buildRouletteBetPayload,
  getPlacedBetsTotal,
} from "@/features/roulette/model/roulette-bets";
import { useRouletteStore } from "@/features/roulette/model/use-roulette-store";
import { BetControls } from "@/features/roulette/ui/BetControls";
import { BettingBoard } from "@/features/roulette/ui/BettingBoard";
import { RouletteHistory } from "@/features/roulette/ui/RouletteHistory";
import { RouletteResult } from "@/features/roulette/ui/RouletteResult";
import { RouletteWheel } from "@/features/roulette/ui/RouletteWheel";

const AUTO_NEXT_SPIN_DELAY_MS = 6200;

type RouletteBetMutationVariables = {
  payload: RouletteBetRequest;
  clearBetsOnSuccess: boolean;
};

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
  const autoPayloadRef = useRef<RouletteBetRequest | null>(null);
  const autoRemainingRef = useRef(0);
  const autoTimeoutRef = useRef<number | null>(null);
  const isAutoRunningRef = useRef(false);
  const [betMode, setBetMode] = useState<"manual" | "auto">("manual");
  const [autoBetCount, setAutoBetCount] = useState("10");
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const selectedChip = useRouletteStore((state) => state.selectedChip);
  const placedBets = useRouletteStore((state) => state.placedBets);
  const isSpinning = useRouletteStore((state) => state.isSpinning);
  const result = useRouletteStore((state) => state.result);
  const resultHistory = useRouletteStore((state) => state.resultHistory);
  const selectChip = useRouletteStore((state) => state.selectChip);
  const placeBet = useRouletteStore((state) => state.placeBet);
  const clearBets = useRouletteStore((state) => state.clearBets);
  const undoBet = useRouletteStore((state) => state.undoBet);
  const startSpin = useRouletteStore((state) => state.startSpin);
  const finishSpin = useRouletteStore((state) => state.finishSpin);
  const stopSpin = useRouletteStore((state) => state.stopSpin);
  const settleResultHistory = useRouletteStore(
    (state) => state.settleResultHistory,
  );

  const configQuery = useQuery({
    queryKey: ["roulette", "config"],
    queryFn: async () => (await getRouletteConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  function clearAutoTimeout() {
    if (autoTimeoutRef.current !== null) {
      window.clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
  }

  function stopAutoBetting() {
    isAutoRunningRef.current = false;
    autoRemainingRef.current = 0;
    autoPayloadRef.current = null;
    clearAutoTimeout();
    setIsAutoRunning(false);
  }

  const betMutation = useMutation({
    mutationFn: async ({ payload }: RouletteBetMutationVariables) => {
      return (await placeRouletteBet(payload)).data;
    },
    onMutate: () => {
      startSpin();
    },
    onError: () => {
      stopAutoBetting();
      stopSpin();
    },
    onSuccess: async (response, variables) => {
      finishSpin(response, { clearBets: variables.clearBetsOnSuccess });
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      if (!isAutoRunningRef.current || !autoPayloadRef.current) {
        return;
      }

      if (!isAutoInfinite) {
        autoRemainingRef.current -= 1;
      }

      if (!isAutoInfinite && autoRemainingRef.current <= 0) {
        stopAutoBetting();

        return;
      }

      autoTimeoutRef.current = window.setTimeout(() => {
        if (!isAutoRunningRef.current || !autoPayloadRef.current) {
          return;
        }

        betMutation.mutate({
          clearBetsOnSuccess: false,
          payload: autoPayloadRef.current,
        });
      }, AUTO_NEXT_SPIN_DELAY_MS);
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

  function handleAutoBetCountChange(value: string) {
    setAutoBetCount(value.replace(/[^\d]/g, ""));
  }

  function handleToggleAutoInfinite() {
    setIsAutoInfinite((currentValue) => !currentValue);
  }

  function startAutoBetting() {
    const payload = buildRouletteBetPayload(placedBets);
    const normalizedAutoBetCount = Number(autoBetCount);

    autoPayloadRef.current = payload;
    autoRemainingRef.current = isAutoInfinite ? Infinity : normalizedAutoBetCount;
    isAutoRunningRef.current = true;
    setIsAutoRunning(true);
    betMutation.mutate({ clearBetsOnSuccess: false, payload });
  }

  function handleBetSubmit() {
    if (isAutoRunning) {
      stopAutoBetting();

      return;
    }

    const payload = buildRouletteBetPayload(placedBets);

    if (betMode === "auto") {
      startAutoBetting();

      return;
    }

    betMutation.mutate({ clearBetsOnSuccess: false, payload });
  }

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-3 py-5 text-white md:px-[10px] md:py-7">
      <div className="mx-auto grid w-full max-w-[1017px] overflow-hidden shadow-[0_22px_80px_rgb(0_0_0_/_28%)] lg:h-[668px] lg:grid-cols-[352px_665px]">
        <BetControls
          autoBetCount={autoBetCount}
          canUndo={placedBets.length > 0}
          errorMessage={errorMessage}
          gameBalance={gameBalance}
          isAutoInfinite={isAutoInfinite}
          isAutoRunning={isAutoRunning}
          isSpinning={isSpinning}
          isSubmitting={betMutation.isPending}
          maxBet={maxBet}
          minBet={minBet}
          mode={betMode}
          onAutoBetCountChange={handleAutoBetCountChange}
          onClear={clearBets}
          onModeChange={setBetMode}
          onSelectChip={selectChip}
          onSubmit={handleBetSubmit}
          onToggleAutoInfinite={handleToggleAutoInfinite}
          onUndo={undoBet}
          selectedChip={selectedChip}
          totalBetAmount={totalBetAmount}
        />

        <section className="relative flex min-w-0 flex-col justify-between gap-7 border-b-2 border-r-2 border-[#0e121c] bg-[#07131d] px-[10px] pb-[30px] pt-5 lg:h-[668px] lg:w-[665px] lg:rounded-[0_16px_16px_0]">
          <RouletteHistory
            results={resultHistory}
            onExitComplete={settleResultHistory}
          />

          <div className="relative mx-auto w-full max-w-[560px]">
            <RouletteWheel
              isSpinning={isSpinning || betMutation.isPending}
              resultNumber={result?.number ?? null}
            />
          </div>

          <div className="space-y-4">
            <BettingBoard
              disabled={isAutoRunning || isSpinning || betMutation.isPending}
              placedBets={placedBets}
              onPlaceBet={placeBet}
            />
            <div className="min-h-[76px]">
              <RouletteResult result={result} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
