import type { MeResponse } from "@/features/auth/api/auth-types";

export function getKenoGameBalance(user: MeResponse | undefined) {
  const balance = user?.userBalances.find(
    (item) => item.balanceType === "GAME_POINTS",
  );
  const value = Number(balance?.value);

  return Number.isFinite(value) ? value : 0;
}
