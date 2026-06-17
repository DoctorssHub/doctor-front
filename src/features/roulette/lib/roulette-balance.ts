import type { MeResponse } from "@/features/auth/api/auth-types";
import type { RouletteBetResponse } from "../api/roulette-types";

export function getGamePointsBalance(user: MeResponse | undefined) {
  const balance = user?.userBalances.find(
    (item) => item.balanceType === "GAME_POINTS",
  );

  return Number(balance?.value ?? 0);
}

function formatBalanceValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function applyRouletteBalanceResult(
  user: MeResponse | undefined,
  response: RouletteBetResponse,
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

      const currentValue = Number(balance.value);

      if (!Number.isFinite(currentValue)) {
        return balance;
      }

      return {
        ...balance,
        value: formatBalanceValue(currentValue - betSize + payout),
      };
    }),
  };
}
