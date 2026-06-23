"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
  formatBetAmount,
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
  type BetAmountControl,
} from "@/widgets/game-sidebar/lib/bet-amount-controls";
import { getKenoConfig, placeKenoBet } from "../api/keno-api";
import type { KenoBetRequest, KenoBetResponse } from "../api/keno-types";
import { getKenoGameBalance } from "../lib/keno-balance";
import { useKenoBettingStore } from "./keno-betting-store";
import { useKenoControlsStore, type KenoRisk } from "./keno-controls-store";

const MAX_AUTO_BETS = 100;
const AUTO_BET_DELAY_MS = 500;

type KenoBetRound = {
  betSize: string;
  risk: KenoRisk;
  selectedNumbers: number[];
};

export function useKenoGame() {
  const queryClient = useQueryClient();
  const revealCompleteResolverRef = useRef<(() => void) | null>(null);
  const shouldStopAutoBetRef = useRef(false);
  const [lastBetResult, setLastBetResult] = useState<KenoBetResponse | null>(
    null,
  );
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null,
  );
  const [resultNumbers, setResultNumbers] = useState<number[]>([]);
  const [roundSelectedNumbers, setRoundSelectedNumbers] = useState<number[]>(
    [],
  );
  const [resultRoundId, setResultRoundId] = useState(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isRevealingResults, setIsRevealingResults] = useState(false);
  const {
    autoBetsAmount,
    betAmount,
    isAutoBetsInfinite,
    mode,
    risk,
    selectedNumbers,
    setBetAmount,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      betAmount: state.betAmount,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      mode: state.mode,
      risk: state.risk,
      selectedNumbers: state.selectedNumbers,
      setBetAmount: state.setBetAmount,
    })),
  );
  const {
    isAutoBetStopRequested,
    isAutoBetting,
    requestAutoBetStop,
    setAutoBetStopRequested,
    setAutoBetting,
  } = useKenoBettingStore(
    useShallow((state) => ({
      isAutoBetStopRequested: state.isAutoBetStopRequested,
      isAutoBetting: state.isAutoBetting,
      requestAutoBetStop: state.requestAutoBetStop,
      setAutoBetStopRequested: state.setAutoBetStopRequested,
      setAutoBetting: state.setAutoBetting,
    })),
  );
  const configQuery = useQuery({
    queryKey: ["keno", "config"],
    queryFn: async () => (await getKenoConfig()).data,
  });
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });
  const betMutation = useMutation({
    mutationFn: async (payload: KenoBetRequest) =>
      (await placeKenoBet(payload)).data,
    onSuccess: async (data: KenoBetResponse) => {
      setLastBetResult(data);
      setResultNumbers(data.results.map((number) => number + 1));
      setIsRevealingResults(true);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
  const gameBalance = getKenoGameBalance(meQuery.data);
  const parsedBetAmount = readBetAmount(betAmount);
  const isBetAmountInvalid =
    parsedBetAmount === null || parsedBetAmount > gameBalance;
  const isManualMode = mode === "Manual";
  const isAutoMode = mode === "Auto";
  const isLoadingGameData = configQuery.isLoading || meQuery.isLoading;
  const errorMessage =
    localErrorMessage ??
    getKenoErrorMessage(betMutation.error ?? configQuery.error ?? meQuery.error);
  const isInteractionLocked =
    betMutation.isPending || isRevealingResults || isAutoBetting;
  const isGameUnavailable = Boolean(configQuery.error || meQuery.error);
  const resultHitCount = roundSelectedNumbers.filter((number) =>
    resultNumbers.includes(number),
  ).length;
  const isBetDisabled = isAutoBetting
    ? isAutoBetStopRequested
    : isBetAmountInvalid ||
      selectedNumbers.length === 0 ||
      isLoadingGameData ||
      betMutation.isPending ||
      isRevealingResults ||
      isGameUnavailable;
  const betButtonLabel = getKenoBetButtonLabel({
    isAutoBetStopRequested,
    isAutoBetting,
    isBetting: betMutation.isPending,
    isAutoMode,
  });

  function handleBetAmountControlClick(control: BetAmountControl) {
    setBetAmount((amount) =>
      getNextBetAmount(amount, control, {
        availableBalance: gameBalance,
      }),
    );
  }

  const waitForRevealComplete = useCallback(() => {
    return new Promise<void>((resolve) => {
      revealCompleteResolverRef.current = resolve;
    });
  }, []);

  const runKenoBet = useCallback(
    async ({ betSize, risk: roundRisk, selectedNumbers }: KenoBetRound) => {
      setIsResultModalVisible(false);
      setLastBetResult(null);
      setResultNumbers([]);
      setRoundSelectedNumbers([...selectedNumbers]);
      setResultRoundId((currentRoundId) => currentRoundId + 1);
      setIsRevealingResults(false);

      await betMutation.mutateAsync({
        betSize,
        risk: roundRisk,
        selected: selectedNumbers.map((number) => number - 1),
      });
    },
    [betMutation],
  );

  const handleSubmit = useCallback(async () => {
    if (isAutoBetting) {
      shouldStopAutoBetRef.current = true;
      requestAutoBetStop();
      return;
    }

    setLocalErrorMessage(null);

    if (
      isBetAmountInvalid ||
      parsedBetAmount === null ||
      selectedNumbers.length === 0 ||
      isLoadingGameData ||
      isGameUnavailable ||
      betMutation.isPending ||
      isRevealingResults
    ) {
      return;
    }

    const betSize = formatBetAmount(parsedBetAmount);
    const round: KenoBetRound = {
      betSize,
      risk,
      selectedNumbers: [...selectedNumbers],
    };

    if (isManualMode) {
      try {
        await runKenoBet(round);
      } catch {
        setLocalErrorMessage("Unable to complete the request");
      }

      return;
    }

    const autoBetsCount = Number(autoBetsAmount);

    if (
      !isAutoBetsInfinite &&
      (!Number.isInteger(autoBetsCount) || autoBetsCount < 1)
    ) {
      setLocalErrorMessage("Number of Bets must be at least 1.");
      return;
    }

    if (!isAutoBetsInfinite && autoBetsCount > MAX_AUTO_BETS) {
      setLocalErrorMessage(
        `Number of Bets cannot be greater than ${MAX_AUTO_BETS}.`,
      );
      return;
    }

    if (!isAutoBetsInfinite && parsedBetAmount * autoBetsCount > gameBalance) {
      setLocalErrorMessage(`Not enough balance for ${autoBetsCount} auto bets.`);
      return;
    }

    shouldStopAutoBetRef.current = false;
    setAutoBetting(true);
    setAutoBetStopRequested(false);

    try {
      let index = 0;

      while (isAutoBetsInfinite || index < autoBetsCount) {
        if (shouldStopAutoBetRef.current) {
          break;
        }

        await runKenoBet(round);
        await waitForRevealComplete();

        if (shouldStopAutoBetRef.current) {
          break;
        }

        index += 1;

        if (isAutoBetsInfinite || index < autoBetsCount) {
          await delay(AUTO_BET_DELAY_MS);
        }
      }
    } catch {
      setLocalErrorMessage(
        "Autobet stopped. Balance may be too low or the bet was rejected.",
      );
    } finally {
      shouldStopAutoBetRef.current = false;
      setAutoBetting(false);
      setAutoBetStopRequested(false);
      setIsResultModalVisible(true);
    }
  }, [
    autoBetsAmount,
    betMutation.isPending,
    gameBalance,
    isAutoBetsInfinite,
    isAutoBetting,
    isBetAmountInvalid,
    isGameUnavailable,
    isLoadingGameData,
    isManualMode,
    isRevealingResults,
    parsedBetAmount,
    requestAutoBetStop,
    risk,
    runKenoBet,
    selectedNumbers,
    setAutoBetStopRequested,
    setAutoBetting,
    waitForRevealComplete,
  ]);

  const handleRevealComplete = useCallback(() => {
    setIsRevealingResults(false);

    if (!useKenoBettingStore.getState().isAutoBetting) {
      setIsResultModalVisible(true);
    }

    revealCompleteResolverRef.current?.();
    revealCompleteResolverRef.current = null;
  }, []);

  const handleResultModalClose = useCallback(() => {
    setIsResultModalVisible(false);
  }, []);

  useEffect(() => {
    if (!isResultModalVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsResultModalVisible(false);
    }, 2000);

    function dismissResultModal() {
      setIsResultModalVisible(false);
    }

    document.addEventListener("pointerdown", dismissResultModal);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", dismissResultModal);
    };
  }, [isResultModalVisible]);

  const handleResultsReset = useCallback(() => {
    setIsResultModalVisible(false);
    setLastBetResult(null);
    setResultNumbers([]);
    setRoundSelectedNumbers([]);
    setResultRoundId((currentRoundId) => currentRoundId + 1);
  }, []);

  return {
    betAmount,
    betButtonLabel,
    errorMessage,
    gameBalance,
    isBetDisabled,
    isBetting: betMutation.isPending,
    isInteractionLocked,
    isResultModalVisible,
    isRevealingResults,
    lastBetResult,
    onBetAmountBlur: () => setBetAmount(formatBetAmountInput(betAmount)),
    onBetAmountChange: setBetAmount,
    onBetAmountControlClick: handleBetAmountControlClick,
    onResultModalClose: handleResultModalClose,
    onResultsReset: handleResultsReset,
    onRevealComplete: handleRevealComplete,
    onSubmit: () => {
      void handleSubmit();
    },
    resultHitCount,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
  };
}

function getKenoBetButtonLabel({
  isAutoBetStopRequested,
  isAutoBetting,
  isAutoMode,
  isBetting,
}: {
  isAutoBetStopRequested: boolean;
  isAutoBetting: boolean;
  isAutoMode: boolean;
  isBetting: boolean;
}) {
  if (isAutoBetting) {
    return isAutoBetStopRequested ? "Stopping..." : "Stop Autobet";
  }

  if (isAutoMode) {
    return "Start Autobet";
  }

  if (isBetting) {
    return "Betting...";
  }

  return "Bet";
}

function getKenoErrorMessage(error: unknown) {
  if (!error) {
    return null;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  return "Unable to complete the request";
}

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}