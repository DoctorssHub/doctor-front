import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  getGamePointsBalanceValue,
  readFormattedBalanceValue,
} from "../../../shared/lib/game-points-balance";
import type { DiceBetResponse } from "../api/dice-types";

export function getDiceGamePointsBalance(user: MeResponse | undefined) {
  return getGamePointsBalanceValue(user?.userBalances);
}

export function applyDiceBalanceResult(
  user: MeResponse | undefined,
  response: DiceBetResponse,
) {
  if (!user) {
    return user;
  }

  const betSize = Number(response.betSize);
  const payout = Number(response.payout);

  if (!Number.isFinite(betSize) || !Number.isFinite(payout)) {
    return user;
  }

  return {
    ...user,
    userBalances: user.userBalances.map((balance) => {
      if (balance.balanceType !== "GAME_POINTS") {
        return balance;
      }

      const currentValue = readFormattedBalanceValue(balance.value);

      if (currentValue === null) {
        return balance;
      }

      return {
        ...balance,
        value: formatBalanceValue(currentValue - betSize + payout),
      };
    }),
  };
}

function formatBalanceValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
