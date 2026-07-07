import type { MeResponse } from "@/features/auth/api/auth-types";
import { getGamePointsBalanceValue } from "../../../shared/lib/game-points-balance";

export function getKenoGameBalance(user: MeResponse | undefined) {
  return getGamePointsBalanceValue(user?.userBalances);
}
