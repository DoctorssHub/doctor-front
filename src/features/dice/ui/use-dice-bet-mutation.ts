"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { placeDiceBet } from "../api/dice-api";
import type { DiceBetRequest, DiceBetResponse } from "../api/dice-types";
import { applyDiceBalanceResult } from "../lib/dice-balance";

export function useDiceBetMutation() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<DiceBetResponse | null>(null);
  const [resultHistory, setResultHistory] = useState<DiceBetResponse[]>([]);

  const betMutation = useMutation<DiceBetResponse, Error, DiceBetRequest>({
    mutationFn: async (payload) => {
      return (await placeDiceBet(payload)).data;
    },
    onSuccess: (response) => {
      gameSounds.playResult({
        didWin: response.didWin,
        lossSound: "revealed",
      });

      setResult(response);
      setResultHistory((history) => [...history, response].slice(-6));
      queryClient.setQueryData<MeResponse>(["me"], (user) =>
        applyDiceBalanceResult(user, response),
      );
    },
  });

  return {
    betMutation,
    result,
    resultHistory,
  };
}