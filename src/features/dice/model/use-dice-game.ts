"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
  type BetAmountControl,
} from "@/widgets/game-sidebar/lib/bet-amount-controls";
import { getDiceConfig, placeDiceBet } from "../api/dice-api";
import type { DiceBetRequest, DiceBetResponse } from "../api/dice-types";
import {
  DICE_DEFAULT_MAX_MULTIPLIER,
  DICE_DEFAULT_RTP,
  clampDiceThreshold,
  formatDiceNumber,
  getDiceChance,
  getDiceChanceFromMultiplier,
  getDiceMultiplier,
  getDiceProfitOnWin,
  getDiceThresholdFromChance,
} from "../lib/dice-calculations";
import {
  applyDiceBalanceResult,
  getDiceGamePointsBalance,
} from "../lib/dice-balance";
import { getDiceErrorMessage } from "../lib/dice-errors";

export type DiceMode = "manual" | "auto";

export function useDiceGame() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<DiceMode>("manual");
  const [betAmount, setBetAmount] = useState("10.00");
  const [threshold, setThreshold] = useState(55.55);
  const [above, setAbove] = useState(true);
  const [result, setResult] = useState<DiceBetResponse | null>(null);
  const [resultHistory, setResultHistory] = useState<DiceBetResponse[]>([]);

  const configQuery = useQuery({
    queryKey: ["dice", "config"],
    queryFn: async () => (await getDiceConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  const rtp = configQuery.data?.rtp ?? DICE_DEFAULT_RTP;
  const maxMultiplier =
    configQuery.data?.maxMultiplier ?? DICE_DEFAULT_MAX_MULTIPLIER;
  const minBet = configQuery.data?.minBet ?? 1;
  const maxBet = configQuery.data?.maxBet ?? 100000;
  const gameBalance = getDiceGamePointsBalance(meQuery.data);
  const chance = getDiceChance(threshold, above);
  const multiplier = getDiceMultiplier(chance, rtp, maxMultiplier);
  const profitOnWin = getDiceProfitOnWin(betAmount, multiplier);
  const parsedBetAmount = readBetAmount(betAmount);
  const isBetAmountInvalid =
    parsedBetAmount === null ||
    parsedBetAmount < minBet ||
    parsedBetAmount > maxBet ||
    parsedBetAmount > gameBalance;

  const betMutation = useMutation<DiceBetResponse, Error, DiceBetRequest>({
    mutationFn: async (payload) => {
      return (await placeDiceBet(payload)).data;
    },
    onSuccess: (response) => {
      setResult(response);
      setResultHistory((history) => [...history, response].slice(-6));
      queryClient.setQueryData<MeResponse>(["me"], (user) =>
        applyDiceBalanceResult(user, response),
      );
    },
  });

  const helperMessage = useMemo(() => {
    if (parsedBetAmount !== null && parsedBetAmount > gameBalance) {
      return "Not enough coins";
    }

    if (parsedBetAmount !== null && parsedBetAmount < minBet) {
      return `Minimum bet is ${formatDiceNumber(minBet)}`;
    }

    if (parsedBetAmount !== null && parsedBetAmount > maxBet) {
      return `Maximum bet is ${formatDiceNumber(maxBet)}`;
    }

    if (betMutation.error) {
      return getDiceErrorMessage(betMutation.error);
    }

    if (configQuery.error || meQuery.error) {
      return "Unable to load game data";
    }

    return null;
  }, [
    betMutation.error,
    configQuery.error,
    gameBalance,
    maxBet,
    meQuery.error,
    minBet,
    parsedBetAmount,
  ]);

  function handleBetAmountChange(amount: string) {
    setBetAmount(amount);
  }

  function handleBetAmountBlur() {
    setBetAmount((amount) => formatBetAmountInput(amount));
  }

  function handleBetAmountControlClick(control: BetAmountControl) {
    setBetAmount((amount) =>
      getNextBetAmount(amount, control, {
        availableBalance: gameBalance,
        maxBet: String(maxBet),
        minBet: String(minBet),
      }),
    );
  }

  function handleThresholdChange(nextThreshold: number) {
    setThreshold(clampDiceThreshold(nextThreshold));
  }

  function handleAboveChange(nextAbove: boolean) {
    setAbove(nextAbove);
  }

  function handleMultiplierChange(nextMultiplier: number) {
    const nextChance = getDiceChanceFromMultiplier(
      nextMultiplier,
      rtp,
      maxMultiplier,
    );

    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }

  function handleChanceChange(nextChance: number) {
    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }

  function handleSubmit() {
    const betSize = readBetAmount(betAmount);

    if (betSize === null || isBetAmountInvalid || betMutation.isPending) {
      return;
    }

    betMutation.mutate({
      above,
      betSize: formatDiceNumber(betSize),
      threshold: Number(formatDiceNumber(threshold)),
    });
  }

  return {
    betControlsProps: {
      betAmount,
      gameBalance,
      helperMessage,
      isBetDisabled:
        isBetAmountInvalid || betMutation.isPending || configQuery.isLoading,
      isLoading: betMutation.isPending,
      maxBet: String(maxBet),
      minBet: String(minBet),
      mode,
      profitOnWin,
      onBetAmountBlur: handleBetAmountBlur,
      onBetAmountChange: handleBetAmountChange,
      onBetAmountControlClick: handleBetAmountControlClick,
      onModeChange: setMode,
      onSubmit: handleSubmit,
    },
    gamePanelProps: {
      above,
      chance,
      isLoading: betMutation.isPending,
      multiplier,
      result,
      resultHistory,
      threshold,
      onAboveChange: handleAboveChange,
      onChanceChange: handleChanceChange,
      onMultiplierChange: handleMultiplierChange,
      onThresholdChange: handleThresholdChange,
    },
  };
}
