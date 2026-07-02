import axios from "axios";

export type ExchangeWatchToGameRequest = {
  amount: string;
};

export type ExchangeWatchToGameResponse = {
  watchPointsSpent: number;
  gamePointsReceived: number;
  exchangeRate: number;
  watchPointsBalance: number;
  gamePointsBalance: number;
};

const pointsExchangeClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function exchangeWatchPointsToGamePoints(
  payload: ExchangeWatchToGameRequest,
) {
  return pointsExchangeClient.post<ExchangeWatchToGameResponse>(
    "/balance/watch-to-game",
    payload,
  );
}
