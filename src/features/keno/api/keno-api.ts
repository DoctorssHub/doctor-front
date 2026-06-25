import axios from "axios";
import type {
  KenoBetRequest,
  KenoBetResponse,
  KenoConfigResponse,
} from "./keno-types";

const kenoClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getKenoConfig() {
  return kenoClient.get<KenoConfigResponse>("/games/house/keno/config");
}

export function placeKenoBet(payload: KenoBetRequest) {
  return kenoClient.post<KenoBetResponse>(
    "/games/house/keno/bet",
    payload,
  );
}
