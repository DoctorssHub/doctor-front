"use client";

import { useCallback } from "react";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import {
  type BetAmountControl,
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
} from "@/shared/ui/game-sidebar/lib/bet-amount-controls";

type UsePlinkoBetAmountParams = {
  availableBalance: number | null;
  isAuthenticated: boolean;
  maxBet: string;
  minBet: string;
};

type ValidatePlinkoBetAmountParams = UsePlinkoBetAmountParams & {
  betAmount: string;
};

export function usePlinkoBetAmount({
  availableBalance,
  isAuthenticated,
  maxBet,
  minBet,
}: UsePlinkoBetAmountParams) {
  const betAmount = usePlinkoControlsStore((state) => state.betAmount);
  const setBetAmount = usePlinkoControlsStore((state) => state.setBetAmount);

  const handleBetAmountControlClick = useCallback(
    (control: BetAmountControl) => {
      setBetAmount((currentAmount) =>
        getNextBetAmount(currentAmount, control, {
          availableBalance,
          maxBet,
          minBet,
        }),
      );
    },
    [availableBalance, maxBet, minBet, setBetAmount],
  );

  const handleBetAmountBlur = useCallback(() => {
    setBetAmount((currentAmount) => formatBetAmountInput(currentAmount));
  }, [setBetAmount]);

  const validateBetAmount = useCallback(() => {
    return validatePlinkoBetAmount({
      availableBalance,
      betAmount,
      isAuthenticated,
      maxBet,
      minBet,
    });
  }, [availableBalance, betAmount, isAuthenticated, maxBet, minBet]);

  return {
    betAmount,
    handleBetAmountBlur,
    handleBetAmountControlClick,
    setBetAmount,
    validateBetAmount,
  };
}

export function validatePlinkoBetAmount({
  availableBalance,
  betAmount,
  isAuthenticated,
  maxBet,
  minBet,
}: ValidatePlinkoBetAmountParams) {
  const amount = readBetAmount(betAmount);
  const minBetValue = Number(minBet);
  const maxBetValue = Number(maxBet);

  if (amount === null) {
    return "Enter a valid bet amount.";
  }

  if (Number.isFinite(minBetValue) && amount < minBetValue) {
    return `Minimum bet is ${minBet}.`;
  }

  if (Number.isFinite(maxBetValue) && amount > maxBetValue) {
    return `Maximum bet is ${maxBet}.`;
  }

  if (isAuthenticated && availableBalance !== null && amount > availableBalance) {
    return "Not enough balance.";
  }

  return "";
}
