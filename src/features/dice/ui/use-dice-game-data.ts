"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import { getDiceConfig } from "../api/dice-api";
import { getDiceGamePointsBalance } from "../lib/dice-balance";
import {
  DICE_DEFAULT_MAX_MULTIPLIER,
  DICE_DEFAULT_RTP,
} from "../lib/dice-calculations";

export function useDiceGameData() {
  const configQuery = useQuery({
    queryKey: ["dice", "config"],
    queryFn: async () => (await getDiceConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  return {
    configQuery,
    meQuery,
    gameBalance: getDiceGamePointsBalance(meQuery.data),
    maxBet: configQuery.data?.maxBet ?? 100000,
    maxMultiplier:
      configQuery.data?.maxMultiplier ?? DICE_DEFAULT_MAX_MULTIPLIER,
    minBet: configQuery.data?.minBet ?? 1,
    rtp: configQuery.data?.rtp ?? DICE_DEFAULT_RTP,
  };
}