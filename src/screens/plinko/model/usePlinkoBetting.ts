"use client";

import { useCallback, useRef, useState } from "react";
import type { GameMode, Risk } from "@/entities/game/model/types";
import {
  placePlinkoBet,
  readPlinkoBet,
} from "@/features/plinko/api/plinko-api";
import type { usePlinkoRounds } from "./usePlinkoRounds";
import { validateFiniteAutoBetBudget } from "../lib/plinko-controls";

const MAX_AUTO_BETS = 100;
const AUTO_BET_DELAY_MS = 500;

type UsePlinkoBettingParams = {
  addRound: ReturnType<typeof usePlinkoRounds>["addRound"];
  availableBalance: number | null;
  balanceType: string;
  isAuthenticated: boolean;
  isAutoBetsInfinite: boolean;
  isGameConfigReady: boolean;
  mode: GameMode;
  onAuthRequired: () => void;
  readCurrentBetAmount: () => number | null;
  risk: Risk;
  rows: number;
  validateBetAmount: () => string;
};

type BetRequest = {
  amount: string;
  balanceType: string;
  mode: GameMode;
  risk: Risk;
  rows: number;
};

export function usePlinkoBetting({
  addRound,
  availableBalance,
  balanceType,
  isAuthenticated,
  isAutoBetsInfinite,
  isGameConfigReady,
  mode,
  onAuthRequired,
  readCurrentBetAmount,
  risk,
  rows,
  validateBetAmount,
}: UsePlinkoBettingParams) {
  const [autoBetsAmount, setAutoBetsAmount] = useState("2");
  const [isBetting, setIsBetting] = useState(false);
  const [isAutoBetting, setIsAutoBetting] = useState(false);
  const [isAutoBetStopRequested, setIsAutoBetStopRequested] = useState(false);
  const [betValidationError, setBetValidationError] = useState("");
  const shouldStopAutoBetRef = useRef(false);

  const runPlinkoBet = useCallback(
    async (request: BetRequest) => {
      const bet = readPlinkoBet(await placePlinkoBet(request), request);

      addRound({ bet, request });
    },
    [addRound],
  );

  const clearBetValidationError = useCallback(() => {
    setBetValidationError("");
  }, []);

  const handleBetClick = useCallback(
    async (betAmount: string) => {
      if (isAutoBetting) {
        shouldStopAutoBetRef.current = true;
        setIsAutoBetStopRequested(true);
        return;
      }

      setBetValidationError("");

      if (!isAuthenticated) {
        onAuthRequired();
        return;
      }

      if (!isGameConfigReady) {
        setBetValidationError("Game settings are not loaded yet.");
        return;
      }

      const amountError = validateBetAmount();

      if (amountError) {
        setBetValidationError(amountError);
        return;
      }

      const amount = readCurrentBetAmount();

      if (amount === null) {
        setBetValidationError("Enter a valid bet amount.");
        return;
      }

      if (mode === "Manual") {
        setIsBetting(true);

        try {
          await runPlinkoBet({
            amount: betAmount,
            balanceType,
            mode,
            risk,
            rows,
          });
        } catch {
          setBetValidationError("Unable to place bet. Please try again.");
        } finally {
          setIsBetting(false);
        }

        return;
      }

      const autoBetsCount = Number(autoBetsAmount);

      if (
        !isAutoBetsInfinite &&
        (!Number.isInteger(autoBetsCount) || autoBetsCount < 1)
      ) {
        setBetValidationError("Number of Bets must be at least 1.");
        return;
      }

      if (!isAutoBetsInfinite && autoBetsCount > MAX_AUTO_BETS) {
        setBetValidationError(
          `Number of Bets cannot be greater than ${MAX_AUTO_BETS}.`,
        );
        return;
      }

      if (!isAutoBetsInfinite) {
        const budgetError = validateFiniteAutoBetBudget({
          amount,
          autoBetsCount,
          availableBalance,
        });

        if (budgetError) {
          setBetValidationError(budgetError);
          return;
        }
      }

      shouldStopAutoBetRef.current = false;
      setIsAutoBetting(true);
      setIsAutoBetStopRequested(false);

      try {
        let index = 0;

        while (isAutoBetsInfinite || index < autoBetsCount) {
          if (shouldStopAutoBetRef.current) {
            break;
          }

          await runPlinkoBet({
            amount: betAmount,
            balanceType,
            mode,
            risk,
            rows,
          });

          if (shouldStopAutoBetRef.current) {
            break;
          }

          index += 1;

          if (isAutoBetsInfinite || index < autoBetsCount) {
            await delay(AUTO_BET_DELAY_MS);
          }
        }
      } catch {
        setBetValidationError(
          "Autobet stopped. Balance may be too low or the bet was rejected.",
        );
      } finally {
        shouldStopAutoBetRef.current = false;
        setIsAutoBetting(false);
        setIsAutoBetStopRequested(false);
      }
    },
    [
      autoBetsAmount,
      availableBalance,
      balanceType,
      isAutoBetsInfinite,
      isAutoBetting,
      isGameConfigReady,
      isAuthenticated,
      mode,
      onAuthRequired,
      readCurrentBetAmount,
      risk,
      rows,
      runPlinkoBet,
      validateBetAmount,
    ],
  );

  return {
    autoBetsAmount,
    betValidationError,
    clearBetValidationError,
    handleBetClick,
    isAutoBetStopRequested,
    isAutoBetting,
    isBetting,
    setAutoBetsAmount,
  };
}

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
