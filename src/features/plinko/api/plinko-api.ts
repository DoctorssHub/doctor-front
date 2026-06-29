import { authenticatedClient, requestWithAuthRetry } from "@/shared/api";
import type { PlinkoBetRequest } from "./plinko-parsers";

export type { PlinkoBetRequest } from "./plinko-parsers";
export { readPlinkoBet, readPlinkoConfig } from "./plinko-parsers";

export async function getPlinkoConfig() {
  const response = await authenticatedClient.get<unknown>(
    "/games/house/plinko/config",
  );

  return response.data;
}

export async function placePlinkoBet(payload: PlinkoBetRequest) {
  const response = await requestWithAuthRetry(() =>
    authenticatedClient.post<unknown>(
      "/games/house/plinko/bet",
      createPlinkoBetPayload(payload),
    ),
  );

  return response.data;
}

function createPlinkoBetPayload(payload: PlinkoBetRequest) {
  return {
    balanceType: payload.balanceType,
    betSize: payload.amount,
    risk: payload.risk,
    rowsCount: payload.rows,
  };
}
