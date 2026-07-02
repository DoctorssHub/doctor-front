"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useAuthSessionStore } from "@/features/auth";
import { exchangeWatchPointsToGamePoints } from "../../api/points-exchange-api";
import {
  findGamePointsBalance,
  findWatchPointsBalance,
  readNumericBalanceValue,
  updateExchangeBalances,
} from "../../lib/points-exchange-balances";
import {
  formatDecimalRequestAmount,
  formatInputAmount,
  parseInputAmount,
} from "../../lib/points-exchange-format";

const EXCHANGE_RATE = 1;

export function usePointsExchangeForm({ onClose }: { onClose: () => void }) {
  const { balances, setSession, username } = useAuthSessionStore(
    useShallow((state) => ({
      balances: state.balances,
      setSession: state.setSession,
      username: state.username,
    })),
  );
  const watchPointsBalance = findWatchPointsBalance(balances);
  const gamePointsBalance = findGamePointsBalance(balances);
  const watchPointsValue = readNumericBalanceValue(watchPointsBalance);
  const gamePointsValue = readNumericBalanceValue(gamePointsBalance);
  const [amountValue, setAmountValue] = useState("");
  const amount = parseInputAmount(amountValue);
  const receivedAmount = amount * EXCHANGE_RATE;

  const exchangeMutation = useMutation({
    mutationFn: exchangeWatchPointsToGamePoints,
    onSuccess: (response) => {
      if (username) {
        setSession(
          username,
          updateExchangeBalances({
            balances,
            gamePointsBalance: response.data.gamePointsBalance,
            watchPointsBalance: response.data.watchPointsBalance,
          }),
        );
      }

      onClose();
    },
  });

  const hasInsufficientWatchPoints = amount > watchPointsValue;
  const validationErrorMessage = hasInsufficientWatchPoints
    ? "Insufficient Watch Points balance."
    : exchangeMutation.isError
      ? "Invalid amount or insufficient WATCH_POINTS balance."
      : null;
  const isConfirmDisabled =
    amount <= 0 || hasInsufficientWatchPoints || exchangeMutation.isPending;

  const handleAmountChange = (nextValue: string) => {
    if (exchangeMutation.isError) {
      exchangeMutation.reset();
    }

    setAmountValue(nextValue);
  };

  const handleRawAmountChange = (nextValue: string) => {
    handleAmountChange(formatInputAmount(nextValue));
  };

  const handleConfirm = () => {
    if (isConfirmDisabled) {
      return;
    }

    exchangeMutation.mutate({ amount: formatDecimalRequestAmount(amount) });
  };

  return {
    amountValue,
    gamePointsValue,
    handleConfirm,
    handleRawAmountChange,
    isConfirmDisabled,
    isSubmitting: exchangeMutation.isPending,
    receivedAmount,
    validationErrorMessage,
    watchPointsValue,
  };
}
