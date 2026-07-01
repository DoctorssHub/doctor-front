"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { readBetAmount } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
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

const AUTO_BET_COUNT_DEFAULT = "10";
const AUTO_BET_DELAY_MS = 550;
const BET_AMOUNT_DEFAULT = "10.00";

function waitForNextAutoBet() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, AUTO_BET_DELAY_MS);
  });
}

export function useDiceGame() {
  console.count("[dice render] useDiceGame");

  const queryClient = useQueryClient();
  const shouldStopAutoRef = useRef(false);
  const autoBetCountRef = useRef(AUTO_BET_COUNT_DEFAULT);
  const betAmountRef = useRef(BET_AMOUNT_DEFAULT);
  const modeRef = useRef<DiceMode>("manual");
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

  const betMutation = useMutation<DiceBetResponse, Error, DiceBetRequest>({
    mutationFn: async (payload) => {
      return (await placeDiceBet(payload)).data;
    },
    onSuccess: (response) => {
      console.log("[dice action] mutation success", response);

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
  }, [
    betMutation.error,
    configQuery.error,
    meQuery.error,
  ]);

  function handleBetAmountChange(amount: string) {
    console.log("[dice action] bet amount change", amount);
    betAmountRef.current = amount;
  }

  function handleAutoBetCountChange(amount: string) {
    console.log("[dice action] auto bet count change", amount);
    autoBetCountRef.current = amount;
  }

  function handleThresholdChange(nextThreshold: number) {
    console.log("[dice action] threshold change", nextThreshold);
    setThreshold(clampDiceThreshold(nextThreshold));
  }

  function handleAboveChange(nextAbove: boolean) {
    console.log("[dice action] above change", nextAbove);

    if (nextAbove !== above) {
      setThreshold((currentThreshold) =>
        clampDiceThreshold(100 - currentThreshold),
      );
    }

    setAbove(nextAbove);
  }

  function handleMultiplierChange(nextMultiplier: number) {
    console.log("[dice action] multiplier change", nextMultiplier);

    const nextChance = getDiceChanceFromMultiplier(
      nextMultiplier,
      rtp,
      maxMultiplier,
    );

    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }

  function handleChanceChange(nextChance: number) {
    console.log("[dice action] chance change", nextChance);
    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }

  function getBetPayload() {
    const betSize = readBetAmount(betAmountRef.current);

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
    console.log("[dice action] auto run start", {
      payload,
      plannedBets,
    });

    let remainingBets = plannedBets;

    shouldStopAutoRef.current = false;
    setIsAutoRunning(true);
    setIsAutoStopRequested(false);

    try {
      while (!shouldStopAutoRef.current && remainingBets > 0) {
        console.log("[dice action] auto bet iteration", {
          remainingBets,
        });

        gameSounds.playBetStart("dice");
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
      console.log("[dice action] auto run finish");
      shouldStopAutoRef.current = false;
      setIsAutoRunning(false);
      setIsAutoStopRequested(false);
    }
  }

  function handleSubmit() {
    const mode = modeRef.current;

    console.log("[dice action] submit", {
      isAutoRunning,
      mode,
    });

    if (mode === "auto" && isAutoRunning) {
      console.log("[dice action] request auto stop");
      shouldStopAutoRef.current = true;
      setIsAutoStopRequested(true);
      return;
    }

    const payload = getBetPayload();
    const betSize = readBetAmount(betAmountRef.current);
    const isBetAmountInvalid =
      betSize === null ||
      betSize < minBet ||
      betSize > maxBet ||
      betSize > gameBalance;

    if (!payload || isBetAmountInvalid || betMutation.isPending) {
      console.log("[dice action] submit blocked", {
        hasPayload: Boolean(payload),
        isBetAmountInvalid,
        isPending: betMutation.isPending,
      });

      return;
    }

    if (mode === "auto") {
      const parsedAutoBetCount = Number(autoBetCountRef.current);
      const isAutoBetCountInvalid =
        !isAutoInfinite &&
        (!Number.isInteger(parsedAutoBetCount) || parsedAutoBetCount < 1);

      if (isAutoBetCountInvalid) {
        console.log("[dice action] auto submit blocked", {
          isAutoBetCountInvalid,
        });

        return;
      }

      void runAutoBets(
        payload,
        isAutoInfinite ? Number.POSITIVE_INFINITY : parsedAutoBetCount,
      );
      return;
    }

    gameSounds.playBetStart("dice");
    console.log("[dice action] manual bet mutate", payload);
    betMutation.mutate(payload);
  }

  return {
    betControlsProps: {
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
        console.log("[dice action] auto config apply");
        setIsAutoConfigOpen(false);
      },
      onAutoConfigChange: (config) => {
        console.log("[dice action] auto config change", config);
        setAutoConfig(config);
      },
      onAutoConfigClose: () => {
        console.log("[dice action] auto config close");
        setIsAutoConfigOpen(false);
      },
      onAutoConfigOpen: () => {
        console.log("[dice action] auto config open");
        setIsAutoConfigOpen(true);
      },
      onAutoConfigResetAll: () => {
        console.log("[dice action] auto config reset all");
        setAutoConfig(DEFAULT_AUTO_CONFIG);
      },
      onBetAmountChange: handleBetAmountChange,
      onModeChange: (nextMode) => {
        console.log("[dice action] mode change", nextMode);
        modeRef.current = nextMode;
      },
      onSubmit: handleSubmit,
      onToggleAutoInfinite: () => {
        console.log("[dice action] toggle auto infinite");
        setIsAutoInfinite((current) => !current);
      },
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
