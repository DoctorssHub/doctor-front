"use client";

import { useAuthSessionStore } from "@/features/auth";
import {
  findGamePointsBalance,
  readFormattedBalanceValue,
} from "../../../shared/lib/game-points-balance";

const FALLBACK_GAME_POINTS_BALANCE_TYPE = "GAME_POINTS";

export function usePlinkoBalance() {
  const balances = useAuthSessionStore((state) => state.balances);
  const gamePointsBalance = findGamePointsBalance(balances);

  return {
    availableBalance: readFormattedBalanceValue(gamePointsBalance?.value),
    balanceLabel: gamePointsBalance?.value,
    balanceType:
      gamePointsBalance?.balanceType || FALLBACK_GAME_POINTS_BALANCE_TYPE,
  };
}
