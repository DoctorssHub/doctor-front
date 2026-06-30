import { useQuery } from "@tanstack/react-query";

import { getRewardDetails, getRewards } from "../api/rewards-api";
import type { RewardQuery } from "./types";

export function useRewards(query: RewardQuery) {
  return useQuery({
    queryKey: ["rewards", query],
    queryFn: () => getRewards(query),
    placeholderData: (previousData) => previousData,
  });
}

export function useRewardDetails(id: string) {
  return useQuery({
    queryKey: ["rewards", "details", id],
    queryFn: () => getRewardDetails(id),
    enabled: Boolean(id),
  });
}
