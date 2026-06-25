import axios from "axios";
import type {
  DailyClaimerClaimResponse,
  DailyClaimerStatusResponse,
} from "./daily-claimer-types";

const dailyClaimerClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getDailyClaimerStatus() {
  return dailyClaimerClient.get<DailyClaimerStatusResponse>(
    "/daily-claimer/status",
  );
}

export function claimDailyPoints() {
  return dailyClaimerClient.post<DailyClaimerClaimResponse>(
    "/daily-claimer/claim",
  );
}
