import type { PlinkoBetRequest } from "./plinko-parsers";
import { plinkoClient, requestWithAuthRetry } from "./plinko-client";

export type { PlinkoBetRequest } from "./plinko-parsers";
export { readPlinkoBet, readPlinkoConfig } from "./plinko-parsers";

export async function getPlinkoConfig() {
  const response = await plinkoClient.get<unknown>(
    "/games/house/plinko/config",
  );

  return response.data;
}

export async function placePlinkoBet(payload: PlinkoBetRequest) {
  const response = await requestWithAuthRetry(() =>
    plinkoClient.post<unknown>(
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
