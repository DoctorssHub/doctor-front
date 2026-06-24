"use client";

import { useCallback, useRef, useState } from "react";
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
import { getKenoBetButtonLabel } from "../lib/keno-bet-label";
import { getKenoGameBalance } from "../lib/keno-balance";
import { getKenoErrorMessage } from "../lib/keno-error-message";
import { useKenoAutoBet, type KenoBetRound } from "./use-keno-auto-bet";
import { useKenoBettingStore } from "./keno-betting-store";
import { useKenoControlsStore } from "./keno-controls-store";
import { useKenoResultModal } from "./use-keno-result-modal";
import { useKenoRoundState } from "./use-keno-round-state";

export function useKenoGame() {
  const queryClient = useQueryClient();
  const revealCompleteResolverRef = useRef<(() => void) | null>(null);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null,
  );
  const {
    beginRound,
    completeReveal,
    isRevealingResults,
    lastBetResult,
    resetRound,
    resultHitCount,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
    setRoundResult,
  } = useKenoRoundState();
  const {
    hideResultModal,
    isResultModalVisible,
    showResultModal,
  } = useKenoResultModal();
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
  const { isAutoBetStopRequested, isAutoBetting } = useKenoBettingStore(
    useShallow((state) => ({
      isAutoBetStopRequested: state.isAutoBetStopRequested,
      isAutoBetting: state.isAutoBetting,
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
      setRoundResult(data);
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
      hideResultModal();
      beginRound(selectedNumbers);

      await betMutation.mutateAsync({
        betSize,
        risk: roundRisk,
        selected: selectedNumbers.map((number) => number - 1),
      });
    },
    [beginRound, betMutation, hideResultModal],
  );

  const { requestStop, runAutoBet } = useKenoAutoBet({
    autoBetsAmount,
    gameBalance,
    isAutoBetsInfinite,
    parsedBetAmount: parsedBetAmount ?? 0,
    runKenoBet,
    setLocalErrorMessage,
    waitForRevealComplete,
  });

  const handleSubmit = useCallback(async () => {
    if (isAutoBetting) {
      requestStop();
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

    const round: KenoBetRound = {
      betSize: formatBetAmount(parsedBetAmount),
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

    await runAutoBet(round);
  }, [
    betMutation.isPending,
    isAutoBetting,
    isBetAmountInvalid,
    isGameUnavailable,
    isLoadingGameData,
    isManualMode,
    isRevealingResults,
    parsedBetAmount,
    requestStop,
    risk,
    runAutoBet,
    runKenoBet,
    selectedNumbers,
  ]);

  const handleRevealComplete = useCallback(() => {
    completeReveal();

    showResultModal();

    revealCompleteResolverRef.current?.();
    revealCompleteResolverRef.current = null;
  }, [completeReveal, showResultModal]);

  const handleResultsReset = useCallback(() => {
    hideResultModal();
    resetRound();
  }, [hideResultModal, resetRound]);

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
    onResultModalClose: hideResultModal,
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
