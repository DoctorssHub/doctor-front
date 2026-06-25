import { useQuery } from "@tanstack/react-query";

import { getLatestLeaderboardDetails } from "../api/leaderboard-api";

export function useLatestLeaderboard(take: number) {
  return useQuery({
    queryKey: ["leaderboard", "latest", take],
    queryFn: () => getLatestLeaderboardDetails(take),
    placeholderData: (previousData) => previousData,
  });
}
