"use client";

import { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import type { GameMode, Risk } from "@/entities/game/model/types";
import {
  placePlinkoBet,
  readPlinkoBet,
} from "@/features/plinko/api/plinko-api";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import type { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { useGameSounds } from "@/shared/lib/sound/use-game-sounds";
import { readBetAmount } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { validateFiniteAutoBetBudget } from "../lib/plinko-controls";
import { validatePlinkoBetAmount } from "./usePlinkoBetAmount";

const MAX_AUTO_BETS = 100;
const AUTO_BET_DELAY_MS = 500;

type UsePlinkoBettingParams = {
  addRound: ReturnType<typeof usePlinkoRoundsStore.getState>["addRound"];
  availableBalance: number | null;
  balanceType: string;
  isAuthenticated: boolean;
  isGameConfigReady: boolean;
  maxBet: string;
  minBet: string;
  onAuthRequired: () => void;
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
  isGameConfigReady,
  maxBet,
  minBet,
  onAuthRequired,
}: UsePlinkoBettingParams) {
  const sounds = useGameSounds();
  const {
    isAutoBetting,
    requestAutoBetStop,
    setAutoBetStopRequested,
    setAutoBetting,
    setBetValidationError,
    setBetting,
  } = usePlinkoBettingStore(
    useShallow((state) => ({
      isAutoBetting: state.isAutoBetting,
      requestAutoBetStop: state.requestAutoBetStop,
      setAutoBetStopRequested: state.setAutoBetStopRequested,
      setAutoBetting: state.setAutoBetting,
      setBetValidationError: state.setBetValidationError,
      setBetting: state.setBetting,
    })),
  );
  const shouldStopAutoBetRef = useRef(false);

  const runPlinkoBet = useCallback(
    async (request: BetRequest) => {
      const bet = readPlinkoBet(await placePlinkoBet(request), request);

      addRound({ bet, request });
      sounds.playRolling();
    },
    [addRound, sounds],
  );

  const handleBetClick = useCallback(
    async () => {
      if (isAutoBetting) {
        shouldStopAutoBetRef.current = true;
        requestAutoBetStop();
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

      const {
        autoBetsAmount,
        betAmount,
        isAutoBetsInfinite,
        mode,
        risk,
        rows,
      } = usePlinkoControlsStore.getState();
      const amountError = validatePlinkoBetAmount({
        availableBalance,
        betAmount,
        isAuthenticated,
        maxBet,
        minBet,
      });

      if (amountError) {
        setBetValidationError(amountError);
        return;
      }

      const amount = readBetAmount(betAmount);

      if (amount === null) {
        setBetValidationError("Enter a valid bet amount.");
        return;
      }

      if (mode === "Manual") {
        setBetting(true);

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
          setBetting(false);
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
      setAutoBetting(true);
      setAutoBetStopRequested(false);

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
        setAutoBetting(false);
        setAutoBetStopRequested(false);
      }
    },
    [
      availableBalance,
      balanceType,
      isAutoBetting,
      isGameConfigReady,
      isAuthenticated,
      maxBet,
      minBet,
      onAuthRequired,
      requestAutoBetStop,
      runPlinkoBet,
      setAutoBetStopRequested,
      setAutoBetting,
      setBetValidationError,
      setBetting,
    ],
  );

  return {
    handleBetClick,
  };
}

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
