"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
  formatBetAmount,
  readBetAmount,
} from "@/widgets/game-sidebar/lib/bet-amount-controls";
import { getKenoConfig, placeKenoBet } from "../api/keno-api";
import type { KenoBetRequest, KenoBetResponse } from "../api/keno-types";
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
  const { error: betError, isPending: isBetPending, mutateAsync: placeBet } =
    useMutation({
      mutationFn: async (payload: KenoBetRequest) =>
        (await placeKenoBet(payload)).data,
      onSuccess: async (data: KenoBetResponse) => {
        setRoundResult(data);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    });
  const gameBalance = getKenoGameBalance(meQuery.data);
  const isLoadingGameData = configQuery.isLoading || meQuery.isLoading;
  const errorMessage =
    localErrorMessage ??
    getKenoErrorMessage(betError ?? configQuery.error ?? meQuery.error);
  const isInteractionLocked =
    isBetPending || isRevealingResults || isAutoBetting;
  const isGameUnavailable = Boolean(configQuery.error || meQuery.error);

  const waitForRevealComplete = useCallback(() => {
    return new Promise<void>((resolve) => {
      revealCompleteResolverRef.current = resolve;
    });
  }, []);

  const runKenoBet = useCallback(
    async ({ betSize, risk: roundRisk, selectedNumbers }: KenoBetRound) => {
      hideResultModal();
      beginRound(selectedNumbers);

      await placeBet({
        betSize,
        risk: roundRisk,
        selected: selectedNumbers.map((number) => number - 1),
      });
    },
    [beginRound, hideResultModal, placeBet],
  );

  const { requestStop, runAutoBet } = useKenoAutoBet({
    gameBalance,
    runKenoBet,
    setLocalErrorMessage,
    waitForRevealComplete,
  });

  const handleSubmit = useCallback(async () => {
    if (useKenoBettingStore.getState().isAutoBetting) {
      requestStop();
      return;
    }

    setLocalErrorMessage(null);

    const {
      autoBetsAmount,
      betAmount,
      isAutoBetsInfinite,
      mode,
      risk,
      selectedNumbers,
    } = useKenoControlsStore.getState();
    const parsedBetAmount = readBetAmount(betAmount);
    const isBetAmountInvalid =
      parsedBetAmount === null || parsedBetAmount > gameBalance;

    if (
      isBetAmountInvalid ||
      parsedBetAmount === null ||
      selectedNumbers.length === 0 ||
      isLoadingGameData ||
      isGameUnavailable ||
      isBetPending ||
      isRevealingResults
    ) {
      return;
    }

    const round: KenoBetRound = {
      betSize: formatBetAmount(parsedBetAmount),
      risk,
      selectedNumbers: [...selectedNumbers],
    };

    if (mode === "Manual") {
      try {
        await runKenoBet(round);
      } catch {
        setLocalErrorMessage("Unable to complete the request");
      }

      return;
    }

    await runAutoBet(round, {
      autoBetsAmount,
      isAutoBetsInfinite,
      parsedBetAmount,
    });
  }, [
    gameBalance,
    isBetPending,
    isGameUnavailable,
    isLoadingGameData,
    isRevealingResults,
    requestStop,
    runAutoBet,
    runKenoBet,
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

  const handleSubmitClick = useCallback(() => {
    void handleSubmit();
  }, [handleSubmit]);

  return {
    errorMessage,
    gameBalance,
    isAutoBetStopRequested,
    isAutoBetting,
    isBetting: isBetPending,
    isGameUnavailable,
    isInteractionLocked,
    isLoadingGameData,
    isResultModalVisible,
    isRevealingResults,
    lastBetResult,
    onResultModalClose: hideResultModal,
    onResultsReset: handleResultsReset,
    onRevealComplete: handleRevealComplete,
    onSubmit: handleSubmitClick,
    resultHitCount,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
  };
}
