"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  getRouletteConfig,
  placeRouletteBet,
  type RouletteBetRequest,
  type RouletteBetResponse,
} from "@/features/roulette";
import {
  buildRouletteBetPayload,
  getPlacedBetsTotal,
} from "@/features/roulette/model/roulette-bets";
import { useRouletteStore } from "@/features/roulette/model/use-roulette-store";
import { BetControls, RouletteGamePanel } from "@/features/roulette/ui";

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

function formatBalanceValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function applyRouletteBalanceResult(
  user: MeResponse | undefined,
  response: RouletteBetResponse,
) {
  if (!user) {
    return user;
  }

  const betSize = Number(response.betSize);
  const payout = Number(response.payout);

  if (!Number.isFinite(betSize) || !Number.isFinite(payout)) {
    return user;
  }

  return {
    ...user,
    userBalances: user.userBalances.map((balance) => {
      if (balance.balanceType !== "GAME_POINTS") {
        return balance;
      }

      const currentValue = Number(balance.value);

      if (!Number.isFinite(currentValue)) {
        return balance;
      }

      return {
        ...balance,
        value: formatBalanceValue(currentValue - betSize + payout),
      };
    }),
  };
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
  const addResultToHistory = useRouletteStore(
    (state) => state.addResultToHistory,
  );
  const settleResultHistory = useRouletteStore(
    (state) => state.settleResultHistory,
  );
  const [isResultAnimating, setIsResultAnimating] = useState(false);

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

  const handleLandingComplete = useCallback(() => {
    addResultToHistory();
    setIsResultAnimating(false);
  }, [addResultToHistory]);

  const betMutation = useMutation({
    mutationFn: async ({ payload }: RouletteBetMutationVariables) => {
      return (await placeRouletteBet(payload)).data;
    },
    onMutate: () => {
      startSpin();
    },
    onError: () => {
      stopAutoBetting();
      setIsResultAnimating(false);
      stopSpin();
    },
    onSuccess: async (response, variables) => {
      setIsResultAnimating(true);
      finishSpin(response, { clearBets: variables.clearBetsOnSuccess });
      queryClient.setQueryData<MeResponse>(["me"], (user) =>
        applyRouletteBalanceResult(user, response),
      );

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
      <div className="mx-auto grid w-full max-w-[1017px] overflow-hidden shadow-[var(--shadow-roulette-shell)] lg:h-[668px] lg:grid-cols-[352px_665px]">
        <BetControls
          autoBetCount={autoBetCount}
          canUndo={placedBets.length > 0}
          errorMessage={errorMessage}
          gameBalance={gameBalance}
          isAutoInfinite={isAutoInfinite}
          isAutoRunning={isAutoRunning}
          isAnimating={isResultAnimating}
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

        <RouletteGamePanel
          disabled={
            isAutoRunning ||
            isSpinning ||
            betMutation.isPending ||
            isResultAnimating
          }
          isWheelSpinning={isSpinning || betMutation.isPending}
          placedBets={placedBets}
          result={result}
          resultHistory={resultHistory}
          onLandingComplete={handleLandingComplete}
          onPlaceBet={placeBet}
          onSettleResultHistory={settleResultHistory}
        />
      </div>
    </main>
  );
}
