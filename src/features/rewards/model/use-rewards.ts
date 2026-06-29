import { useQuery } from "@tanstack/react-query";

import { getRewards } from "../api/rewards-api";
import type { RewardQuery } from "./types";

export function useRewards(query: RewardQuery) {
  return useQuery({
    queryKey: ["rewards", query],
    queryFn: () => getRewards(query),
    placeholderData: (previousData) => previousData,
  });
}
