"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import {
  formatBetAmount,
  readBetAmount,
} from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { getKenoConfig, placeKenoBet } from "../api/keno-api";
import type { KenoBetRequest, KenoBetResponse } from "../api/keno-types";
import { getKenoGameBalance } from "../lib/keno-balance";
import { getKenoErrorMessage } from "../lib/keno-error-message";
import { useKenoAutoBet, type KenoBetRound } from "./use-keno-auto-bet";
import { useKenoBettingStore } from "./keno-betting-store";
import { useKenoControlsStore } from "./keno-controls-store";
import { useKenoResultModal } from "./use-keno-result-modal";
import { useKenoRoundState } from "./use-keno-round-state";

const KENO_DEFAULT_MIN_BET = 1;
const KENO_DEFAULT_MAX_BET = 100000;

export function useKenoGame() {
  const queryClient = useQueryClient();
  const isMountedRef = useRef(true);
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
  const { hideResultModal, isResultModalVisible, showResultModal } =
    useKenoResultModal();
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
  const maxBet = configQuery.data?.maxBet ?? KENO_DEFAULT_MAX_BET;
  const minBet = configQuery.data?.minBet ?? KENO_DEFAULT_MIN_BET;
  const isLoadingGameData = configQuery.isLoading || meQuery.isLoading;
  const errorMessage =
    localErrorMessage ??
    getKenoErrorMessage(betError ?? configQuery.error ?? meQuery.error);
  const isInteractionLocked =
    isBetPending || isRevealingResults || isAutoBetting;
  const isGameUnavailable = Boolean(configQuery.error || meQuery.error);

  const resolvePendingReveal = useCallback(() => {
    revealCompleteResolverRef.current?.();
    revealCompleteResolverRef.current = null;
  }, []);

  const waitForRevealComplete = useCallback(() => {
    if (!isMountedRef.current) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      if (!isMountedRef.current) {
        resolve();
        return;
      }

      revealCompleteResolverRef.current = resolve;
    });
  }, []);

  const runKenoBet = useCallback(
    async ({ betSize, risk: roundRisk, selectedNumbers }: KenoBetRound) => {
      gameSounds.playBetStart("keno");
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
    maxBet,
    minBet,
    runKenoBet,
    setLocalErrorMessage,
    waitForRevealComplete,
  });

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      requestStop();
      resolvePendingReveal();

      const { setAutoBetStopRequested, setAutoBetting } =
        useKenoBettingStore.getState();

      setAutoBetting(false);
      setAutoBetStopRequested(false);
    };
  }, [requestStop, resolvePendingReveal]);

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
      parsedBetAmount === null ||
      parsedBetAmount < minBet ||
      parsedBetAmount > maxBet ||
      parsedBetAmount > gameBalance;

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
      } catch (error) {
        setLocalErrorMessage(getKenoErrorMessage(error));
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
    maxBet,
    minBet,
    requestStop,
    runAutoBet,
    runKenoBet,
  ]);

  const handleRevealComplete = useCallback(() => {
    const didWin = lastBetResult !== null && Number(lastBetResult.payout) > 0;

    gameSounds.playResult({ didWin, lossSound: "revealed" });

    completeReveal();

    showResultModal();

    resolvePendingReveal();
  }, [
    completeReveal,
    lastBetResult,
    resolvePendingReveal,
    showResultModal,
  ]);

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
    maxBet,
    minBet,
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
