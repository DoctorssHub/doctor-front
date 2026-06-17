import axios from "axios";
import type {
  RouletteBetRequest,
  RouletteBetResponse,
  RouletteConfigResponse,
} from "./roulette-types";

const rouletteClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getRouletteConfig() {
  return rouletteClient.get<RouletteConfigResponse>(
    "/games/house/roulette/config",
  );
}

export function placeRouletteBet(payload: RouletteBetRequest) {
  return rouletteClient.post<RouletteBetResponse>(
    "/games/house/roulette/bet",
    payload,
  );
}
