"use client";

import { useAuthSessionStore } from "@/features/auth";
import type { UserBalance } from "@/features/auth/lib/read-auth-response";

const FALLBACK_GAME_POINTS_BALANCE_TYPE = "GAME_POINTS";

export function usePlinkoBalance() {
  const balances = useAuthSessionStore((state) => state.balances);
  const gamePointsBalance = findGamePointsBalance(balances);

  return {
    availableBalance: readNumericValue(gamePointsBalance?.value),
    balanceLabel: gamePointsBalance?.value,
    balanceType:
      gamePointsBalance?.balanceType || FALLBACK_GAME_POINTS_BALANCE_TYPE,
  };
}

function readNumericValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function findGamePointsBalance(balances: UserBalance[]) {
  return balances.find((balance) => isGamePointsBalanceType(balance.balanceType));
}

function isGamePointsBalanceType(balanceType: string) {
  const normalizedBalanceType = balanceType.replace(/[_\s-]+/g, "").toLowerCase();

  return normalizedBalanceType.includes("gamepoint");
}
