"use client";

import { useMemo } from "react";
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
  const config = useMemo(
    () => readPlinkoConfig(query.data, mockGameConfig),
    [query.data],
  );

  return {
    config,
    errorMessage:
      query.error instanceof Error
        ? "Unable to load game settings. Please try again."
        : undefined,
    hasError: query.isError,
    isLoading: query.isPending,
    isReady: query.isSuccess,
  };
}
