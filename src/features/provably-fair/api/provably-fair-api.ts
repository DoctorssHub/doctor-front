import axios from "axios";
import type {
  FairnessSeedResponse,
  UpdateFairnessSeedRequest,
} from "./provably-fair-types";

const provablyFairClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getFairnessSeed() {
  return provablyFairClient.get<FairnessSeedResponse>("/fairness/seed");
}

export function updateFairnessSeed(payload: UpdateFairnessSeedRequest) {
  return provablyFairClient.put<FairnessSeedResponse>("/fairness/seed", payload);
}
