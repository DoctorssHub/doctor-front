"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPlinkoConfig,
  readPlinkoConfig,
} from "@/features/plinko/api/plinko-api";
import { mockGameConfig } from "@/widgets/plinko-board/model/mock-config";

export function usePlinkoConfig() {
  const query = useQuery({
    queryKey: ["plinko", "config"],
    queryFn: getPlinkoConfig,
  });

  return {
    config: readPlinkoConfig(query.data, mockGameConfig),
    errorMessage:
      query.error instanceof Error
        ? "Unable to load game settings. Please try again."
        : undefined,
    hasError: query.isError,
    isLoading: query.isPending,
    isReady: query.isSuccess,
  };
}
