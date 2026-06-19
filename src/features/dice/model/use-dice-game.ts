"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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

export type DiceAutoConfig = {
  onWinMode: "reset" | "increase";
  onWinIncrease: string;
  onLossMode: "reset" | "increase";
  onLossIncrease: string;
  stopOnProfit: string;
  stopOnLoss: string;
};

const DEFAULT_AUTO_CONFIG: DiceAutoConfig = {
  onWinMode: "reset",
  onWinIncrease: "0.00",
  onLossMode: "reset",
  onLossIncrease: "0.00",
  stopOnProfit: "1.00",
  stopOnLoss: "1.00",
};

const AUTO_BET_DELAY_MS = 550;

function waitForNextAutoBet() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, AUTO_BET_DELAY_MS);
  });
}

export function useDiceGame() {
  const queryClient = useQueryClient();
  const shouldStopAutoRef = useRef(false);
  const [mode, setMode] = useState<DiceMode>("manual");
  const [betAmount, setBetAmount] = useState("10.00");
  const [autoBetCount, setAutoBetCount] = useState("10");
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isAutoStopRequested, setIsAutoStopRequested] = useState(false);
  const [autoConfig, setAutoConfig] =
    useState<DiceAutoConfig>(DEFAULT_AUTO_CONFIG);
  const [isAutoConfigOpen, setIsAutoConfigOpen] = useState(false);
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
  const parsedAutoBetCount = Number(autoBetCount);
  const isAutoBetCountInvalid =
    mode === "auto" &&
    !isAutoInfinite &&
    (!Number.isInteger(parsedAutoBetCount) || parsedAutoBetCount < 1);

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

  useEffect(() => {
    return () => {
      shouldStopAutoRef.current = true;
    };
  }, []);

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

    if (isAutoBetCountInvalid) {
      return "Enter at least 1 bet";
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
    isAutoBetCountInvalid,
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

  function handleAutoBetCountChange(amount: string) {
    setAutoBetCount(amount.replace(/\D/g, ""));
  }

  function handleThresholdChange(nextThreshold: number) {
    setThreshold(clampDiceThreshold(nextThreshold));
  }

  function handleAboveChange(nextAbove: boolean) {
    if (nextAbove !== above) {
      setThreshold((currentThreshold) =>
        clampDiceThreshold(100 - currentThreshold),
      );
    }

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

  function getBetPayload() {
    const betSize = readBetAmount(betAmount);

    if (betSize === null) {
      return null;
    }

    return {
      above,
      betSize: formatDiceNumber(betSize),
      threshold: Number(formatDiceNumber(threshold)),
    };
  }

  async function runAutoBets(payload: DiceBetRequest, plannedBets: number) {
    let remainingBets = plannedBets;

    shouldStopAutoRef.current = false;
    setIsAutoRunning(true);
    setIsAutoStopRequested(false);

    try {
      while (!shouldStopAutoRef.current && remainingBets > 0) {
        await betMutation.mutateAsync(payload);

        if (!isAutoInfinite) {
          remainingBets -= 1;
        }

        if (shouldStopAutoRef.current || remainingBets <= 0) {
          break;
        }

        await waitForNextAutoBet();
      }
    } finally {
      shouldStopAutoRef.current = false;
      setIsAutoRunning(false);
      setIsAutoStopRequested(false);
    }
  }

  function handleSubmit() {
    if (mode === "auto" && isAutoRunning) {
      shouldStopAutoRef.current = true;
      setIsAutoStopRequested(true);
      return;
    }

    const payload = getBetPayload();

    if (!payload || isBetAmountInvalid || betMutation.isPending) {
      return;
    }

    if (mode === "auto") {
      if (isAutoBetCountInvalid) {
        return;
      }

      void runAutoBets(
        payload,
        isAutoInfinite ? Number.POSITIVE_INFINITY : parsedAutoBetCount,
      );
      return;
    }

    betMutation.mutate(payload);
  }

  return {
    betControlsProps: {
      betAmount,
      autoBetCount,
      autoConfig,
      gameBalance,
      helperMessage,
      isAutoConfigOpen,
      isAutoInfinite,
      isAutoRunning,
      isAutoStopRequested,
      isBetDisabled: isAutoRunning
        ? isAutoStopRequested
        : isBetAmountInvalid ||
          isAutoBetCountInvalid ||
          betMutation.isPending ||
          configQuery.isLoading,
      isLoading: betMutation.isPending || isAutoRunning,
      maxBet: String(maxBet),
      minBet: String(minBet),
      mode,
      profitOnWin,
      onAutoBetCountChange: handleAutoBetCountChange,
      onAutoConfigApply: () => setIsAutoConfigOpen(false),
      onAutoConfigChange: setAutoConfig,
      onAutoConfigClose: () => setIsAutoConfigOpen(false),
      onAutoConfigOpen: () => setIsAutoConfigOpen(true),
      onAutoConfigResetAll: () => setAutoConfig(DEFAULT_AUTO_CONFIG),
      onBetAmountBlur: handleBetAmountBlur,
      onBetAmountChange: handleBetAmountChange,
      onBetAmountControlClick: handleBetAmountControlClick,
      onModeChange: setMode,
      onSubmit: handleSubmit,
      onToggleAutoInfinite: () => setIsAutoInfinite((current) => !current),
    },
    gamePanelProps: {
      above,
      chance,
      isLoading: betMutation.isPending || isAutoRunning,
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
