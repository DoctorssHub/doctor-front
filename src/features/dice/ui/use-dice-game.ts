"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { readBetAmount } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { getDiceConfig, placeDiceBet } from "../api/dice-api";
import type { DiceBetRequest, DiceBetResponse } from "../api/dice-types";
import {
  getDiceBetNetResult,
  getNextAutoBetSize,
  shouldStopForAutoLimits,
} from "../lib/dice-auto-betting";
import {
  applyDiceBalanceResult,
  getDiceGamePointsBalance,
} from "../lib/dice-balance";
import {
  DICE_DEFAULT_MAX_MULTIPLIER,
  DICE_DEFAULT_RTP,
  clampDiceThreshold,
  formatDiceNumber,
  getDiceChance,
  getDiceChanceFromMultiplier,
  getDiceMultiplier,
  getDiceThresholdFromChance,
} from "../lib/dice-calculations";
import { getDiceErrorMessage } from "../lib/dice-errors";
import {
  DEFAULT_DICE_AUTO_CONFIG,
  type DiceAutoConfig,
  type DiceMode,
} from "../model/dice-game-options";

const AUTO_BET_COUNT_DEFAULT = "10";
const AUTO_BET_DELAY_MS = 550;
const BET_AMOUNT_DEFAULT = "10.00";

function waitForNextAutoBet() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, AUTO_BET_DELAY_MS);
  });
}

export function useDiceGame() {
  const queryClient = useQueryClient();
  const shouldStopAutoRef = useRef(false);
  const autoBetCountRef = useRef(AUTO_BET_COUNT_DEFAULT);
  const betAmountRef = useRef(BET_AMOUNT_DEFAULT);
  const modeRef = useRef<DiceMode>("manual");
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isAutoStopRequested, setIsAutoStopRequested] = useState(false);
  const [autoConfig, setAutoConfig] = useState<DiceAutoConfig>(
    DEFAULT_DICE_AUTO_CONFIG,
  );
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

  const betMutation = useMutation<DiceBetResponse, Error, DiceBetRequest>({
    mutationFn: async (payload) => {
      return (await placeDiceBet(payload)).data;
    },
    onSuccess: (response) => {
      gameSounds.playResult({
        didWin: response.didWin,
        lossSound: "revealed",
      });

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
    if (betMutation.error) {
      return getDiceErrorMessage(betMutation.error);
    }

    if (configQuery.error || meQuery.error) {
      return "Unable to load game data";
    }

    return null;
  }, [betMutation.error, configQuery.error, meQuery.error]);

  const handleBetAmountChange = useCallback((amount: string) => {
    betAmountRef.current = amount;
  }, []);

  const handleAutoBetCountChange = useCallback((amount: string) => {
    autoBetCountRef.current = amount;
  }, []);

  const handleThresholdChange = useCallback((nextThreshold: number) => {
    setThreshold(clampDiceThreshold(nextThreshold));
  }, []);

  const handleAboveChange = useCallback((nextAbove: boolean) => {
    setThreshold((currentThreshold) =>
      nextAbove === above
        ? currentThreshold
        : clampDiceThreshold(100 - currentThreshold),
    );
    setAbove(nextAbove);
  }, [above]);

  const handleMultiplierChange = useCallback((nextMultiplier: number) => {
    const nextChance = getDiceChanceFromMultiplier(
      nextMultiplier,
      rtp,
      maxMultiplier,
    );

    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }, [above, maxMultiplier, rtp]);

  const handleChanceChange = useCallback((nextChance: number) => {
    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }, [above]);

  const getBetPayload = useCallback((betSize: number) => ({
    above,
    betSize: formatDiceNumber(betSize),
    threshold: Number(formatDiceNumber(threshold)),
  }), [above, threshold]);

  const isValidBetSize = useCallback((betSize: number, balance: number) => {
    return betSize >= minBet && betSize <= maxBet && betSize <= balance;
  }, [maxBet, minBet]);

  const runAutoBets = useCallback(async ({
    config,
    initialBalance,
    initialBetSize,
    isInfinite,
    plannedBets,
    payload,
  }: {
    config: DiceAutoConfig;
    initialBalance: number;
    initialBetSize: number;
    isInfinite: boolean;
    plannedBets: number;
    payload: DiceBetRequest;
  }) => {
    let availableBalance = initialBalance;
    let currentBetSize = initialBetSize;
    let remainingBets = plannedBets;
    let netProfit = 0;

    shouldStopAutoRef.current = false;
    setIsAutoRunning(true);
    setIsAutoStopRequested(false);

    try {
      while (!shouldStopAutoRef.current && remainingBets > 0) {
        if (!isValidBetSize(currentBetSize, availableBalance)) {
          break;
        }

        const currentPayload = {
          ...payload,
          betSize: formatDiceNumber(currentBetSize),
        };

        gameSounds.playBetStart("dice");
        const response = await betMutation.mutateAsync(currentPayload);
        const netResult = getDiceBetNetResult(response);

        netProfit += netResult;
        availableBalance += netResult;

        if (!isInfinite) {
          remainingBets -= 1;
        }

        if (
          shouldStopAutoRef.current ||
          remainingBets <= 0 ||
          shouldStopForAutoLimits(netProfit, config)
        ) {
          break;
        }

        currentBetSize = getNextAutoBetSize(
          currentBetSize,
          initialBetSize,
          response,
          config,
        );

        await waitForNextAutoBet();
      }
    } finally {
      shouldStopAutoRef.current = false;
      setIsAutoRunning(false);
      setIsAutoStopRequested(false);
    }
  }, [betMutation, isValidBetSize]);

  const handleSubmit = useCallback(() => {
    const mode = modeRef.current;

    if (mode === "auto" && isAutoRunning) {
      shouldStopAutoRef.current = true;
      setIsAutoStopRequested(true);
      return;
    }

    const betSize = readBetAmount(betAmountRef.current);
    const isBetAmountInvalid =
      betSize === null || !isValidBetSize(betSize, gameBalance);

    if (betSize === null || isBetAmountInvalid || betMutation.isPending) {
      return;
    }

    const payload = getBetPayload(betSize);

    if (mode === "auto") {
      const parsedAutoBetCount = Number(autoBetCountRef.current);
      const isAutoBetCountInvalid =
        !isAutoInfinite &&
        (!Number.isInteger(parsedAutoBetCount) || parsedAutoBetCount < 1);

      if (isAutoBetCountInvalid) {
        return;
      }

      void runAutoBets({
        config: autoConfig,
        initialBalance: gameBalance,
        initialBetSize: betSize,
        isInfinite: isAutoInfinite,
        payload,
        plannedBets: isAutoInfinite
          ? Number.POSITIVE_INFINITY
          : parsedAutoBetCount,
      });
      return;
    }

    gameSounds.playBetStart("dice");
    betMutation.mutate(payload);
  }, [
    autoConfig,
    betMutation,
    gameBalance,
    getBetPayload,
    isAutoInfinite,
    isAutoRunning,
    isValidBetSize,
    runAutoBets,
  ]);

  const betControlsProps = useMemo(() => ({
    autoConfig,
    gameBalance,
    helperMessage,
    isAutoConfigOpen,
    isAutoInfinite,
    isAutoRunning,
    isAutoStopRequested,
    isBetDisabled: isAutoRunning
      ? isAutoStopRequested
      : betMutation.isPending || configQuery.isLoading,
    isLoading: betMutation.isPending || isAutoRunning,
    maxBet: String(maxBet),
    minBet: String(minBet),
    multiplier,
    onAutoBetCountChange: handleAutoBetCountChange,
    onAutoConfigApply: () => {
      setIsAutoConfigOpen(false);
    },
    onAutoConfigChange: (config: DiceAutoConfig) => {
      setAutoConfig(config);
    },
    onAutoConfigClose: () => {
      setIsAutoConfigOpen(false);
    },
    onAutoConfigOpen: () => {
      setIsAutoConfigOpen(true);
    },
    onAutoConfigResetAll: () => {
      setAutoConfig(DEFAULT_DICE_AUTO_CONFIG);
    },
    onBetAmountChange: handleBetAmountChange,
    onModeChange: (nextMode: DiceMode) => {
      modeRef.current = nextMode;
    },
    onSubmit: handleSubmit,
    onToggleAutoInfinite: () => {
      setIsAutoInfinite((current) => !current);
    },
  }), [
    autoConfig,
    betMutation.isPending,
    configQuery.isLoading,
    gameBalance,
    handleAutoBetCountChange,
    handleBetAmountChange,
    handleSubmit,
    helperMessage,
    isAutoConfigOpen,
    isAutoInfinite,
    isAutoRunning,
    isAutoStopRequested,
    maxBet,
    minBet,
    multiplier,
  ]);

  const gamePanelProps = useMemo(() => ({
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
  }), [
    above,
    betMutation.isPending,
    chance,
    handleAboveChange,
    handleChanceChange,
    handleMultiplierChange,
    handleThresholdChange,
    isAutoRunning,
    multiplier,
    result,
    resultHistory,
    threshold,
  ]);

  return {
    betControlsProps,
    gamePanelProps,
  };
}