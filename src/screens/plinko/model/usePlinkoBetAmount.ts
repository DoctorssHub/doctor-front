"use client";

import { useCallback, useState } from "react";
import {
  type BetAmountControl,
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
} from "@/widgets/game-sidebar/lib/bet-amount-controls";

type UsePlinkoBetAmountParams = {
  availableBalance: number | null;
  isAuthenticated: boolean;
  maxBet: string;
  minBet: string;
};

export function usePlinkoBetAmount({
  availableBalance,
  isAuthenticated,
  maxBet,
  minBet,
}: UsePlinkoBetAmountParams) {
  const [betAmount, setBetAmount] = useState("1.00");

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
    [availableBalance, maxBet, minBet],
  );

  const handleBetAmountBlur = useCallback(() => {
    setBetAmount((currentAmount) => formatBetAmountInput(currentAmount));
  }, []);

  const readCurrentBetAmount = useCallback(() => {
    return readBetAmount(betAmount);
  }, [betAmount]);

  const validateBetAmount = useCallback(() => {
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
  }, [availableBalance, betAmount, isAuthenticated, maxBet, minBet]);

  return {
    betAmount,
    handleBetAmountBlur,
    handleBetAmountControlClick,
    readCurrentBetAmount,
    setBetAmount,
    validateBetAmount,
  };
}
