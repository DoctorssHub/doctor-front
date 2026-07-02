"use client";

import { useCallback, useMemo, useRef } from "react";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { readBetAmount } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { getDiceErrorMessage } from "../lib/dice-errors";
import { useDiceAutoBetting } from "./use-dice-auto-betting";
import { useDiceBetMutation } from "./use-dice-bet-mutation";
import { useDiceBoardState } from "./use-dice-board-state";
import { useDiceGameData } from "./use-dice-game-data";

const BET_AMOUNT_DEFAULT = "10.00";

export function useDiceGame() {
  const betAmountRef = useRef(BET_AMOUNT_DEFAULT);
  const {
    configQuery,
    gameBalance,
    maxBet,
    maxMultiplier,
    meQuery,
    minBet,
    rtp,
  } = useDiceGameData();
  const { betMutation, result, resultHistory } = useDiceBetMutation();
  const board = useDiceBoardState({ maxMultiplier, rtp });

  const isValidBetSize = useCallback((betSize: number, balance: number) => {
    return betSize >= minBet && betSize <= maxBet && betSize <= balance;
  }, [maxBet, minBet]);

  const autoBetting = useDiceAutoBetting({
    isValidBetSize,
    mutateBet: betMutation.mutateAsync,
  });

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

  const handleSubmit = useCallback(() => {
    const mode = autoBetting.getMode();

    if (mode === "auto" && autoBetting.isAutoRunning) {
      autoBetting.requestAutoStop();
      return;
    }

    const betSize = readBetAmount(betAmountRef.current);
    const isBetAmountInvalid =
      betSize === null || !isValidBetSize(betSize, gameBalance);

    if (betSize === null || isBetAmountInvalid || betMutation.isPending) {
      return;
    }

    const payload = board.getBetPayload(betSize);

    if (mode === "auto") {
      const parsedAutoBetCount = Number(autoBetting.getAutoBetCount());
      const isAutoBetCountInvalid =
        !autoBetting.isAutoInfinite &&
        (!Number.isInteger(parsedAutoBetCount) || parsedAutoBetCount < 1);

      if (isAutoBetCountInvalid) {
        return;
      }

      void autoBetting.runAutoBets({
        config: autoBetting.autoConfig,
        initialBalance: gameBalance,
        initialBetSize: betSize,
        isInfinite: autoBetting.isAutoInfinite,
        payload,
        plannedBets: autoBetting.isAutoInfinite
          ? Number.POSITIVE_INFINITY
          : parsedAutoBetCount,
      });
      return;
    }

    gameSounds.playBetStart("dice");
    betMutation.mutate(payload);
  }, [
    autoBetting,
    betMutation,
    board,
    gameBalance,
    isValidBetSize,
  ]);

  const betControlsProps = useMemo(() => ({
    autoConfig: autoBetting.autoConfig,
    gameBalance,
    helperMessage,
    isAutoConfigOpen: autoBetting.isAutoConfigOpen,
    isAutoInfinite: autoBetting.isAutoInfinite,
    isAutoRunning: autoBetting.isAutoRunning,
    isAutoStopRequested: autoBetting.isAutoStopRequested,
    isBetDisabled: autoBetting.isAutoRunning
      ? autoBetting.isAutoStopRequested
      : betMutation.isPending || configQuery.isLoading,
    isLoading: betMutation.isPending || autoBetting.isAutoRunning,
    maxBet: String(maxBet),
    minBet: String(minBet),
    multiplier: board.multiplier,
    onAutoBetCountChange: autoBetting.onAutoBetCountChange,
    onAutoConfigApply: autoBetting.onAutoConfigApply,
    onAutoConfigChange: autoBetting.onAutoConfigChange,
    onAutoConfigClose: autoBetting.onAutoConfigClose,
    onAutoConfigOpen: autoBetting.onAutoConfigOpen,
    onAutoConfigResetAll: autoBetting.onAutoConfigResetAll,
    onBetAmountChange: handleBetAmountChange,
    onModeChange: autoBetting.onModeChange,
    onSubmit: handleSubmit,
    onToggleAutoInfinite: autoBetting.onToggleAutoInfinite,
  }), [
    autoBetting,
    betMutation.isPending,
    board.multiplier,
    configQuery.isLoading,
    gameBalance,
    handleBetAmountChange,
    handleSubmit,
    helperMessage,
    maxBet,
    minBet,
  ]);

  const gamePanelProps = useMemo(() => ({
    above: board.above,
    chance: board.chance,
    isLoading: betMutation.isPending || autoBetting.isAutoRunning,
    multiplier: board.multiplier,
    result,
    resultHistory,
    threshold: board.threshold,
    onAboveChange: board.onAboveChange,
    onChanceChange: board.onChanceChange,
    onMultiplierChange: board.onMultiplierChange,
    onThresholdChange: board.onThresholdChange,
  }), [
    autoBetting.isAutoRunning,
    betMutation.isPending,
    board,
    result,
    resultHistory,
  ]);

  return {
    betControlsProps,
    gamePanelProps,
  };
}