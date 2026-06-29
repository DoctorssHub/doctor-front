import { useQuery } from "@tanstack/react-query";
import { getBetHistory } from "../api/bet-history-api";
import type { BetHistoryQueryParams } from "./types";

type UseBetHistoryOptions = {
  enabled?: boolean;
};

export function useBetHistory(
  params: BetHistoryQueryParams,
  options?: UseBetHistoryOptions,
) {
  return useQuery({
    queryKey: ["bet-history", params],
    queryFn: () => getBetHistory(params),
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled ?? true,
  });
}
