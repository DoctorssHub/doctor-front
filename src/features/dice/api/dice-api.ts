import axios from "axios";
import type {
  DiceBetRequest,
  DiceBetResponse,
  DiceConfigResponse,
} from "./dice-types";

const diceClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getDiceConfig() {
  return diceClient.get<DiceConfigResponse>("/games/house/dice/config");
}

export function placeDiceBet(payload: DiceBetRequest) {
  return diceClient.post<DiceBetResponse>("/games/house/dice/bet", payload);
}
