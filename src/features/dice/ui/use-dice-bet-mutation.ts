"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  creditGamePointsBalanceToAuthSession,
  creditGamePointsBalanceToMeResponse,
  debitGamePointsBalanceFromAuthSession,
  debitGamePointsBalanceFromMeResponse,
} from "@/features/auth";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { useLiveBetRevealStore } from "@/shared/model/live-bet-reveal-store";
import { placeDiceBet } from "../api/dice-api";
import type { DiceBetRequest, DiceBetResponse } from "../api/dice-types";

export function useDiceBetMutation() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<DiceBetResponse | null>(null);
  const [resultHistory, setResultHistory] = useState<DiceBetResponse[]>([]);

  const betMutation = useMutation<DiceBetResponse, Error, DiceBetRequest>({
    mutationFn: async (payload) => {
      return (await placeDiceBet(payload)).data;
    },
    onSuccess: (response) => {
      const debitedUser = debitGamePointsBalanceFromMeResponse(
        queryClient.getQueryData<MeResponse>(["me"]),
        response.betSize,
      );

      queryClient.setQueryData<MeResponse | undefined>(["me"], debitedUser);
      debitGamePointsBalanceFromAuthSession(response.betSize);

      gameSounds.playResult({
        didWin: response.didWin,
        lossSound: "revealed",
      });

      setResult(response);
      setResultHistory((history) => [...history, response].slice(-6));
      useLiveBetRevealStore.getState().markBetRevealed(response.betId);

      const creditedUser = creditGamePointsBalanceToMeResponse(
        queryClient.getQueryData<MeResponse>(["me"]),
        response.payout,
      );

      queryClient.setQueryData<MeResponse | undefined>(["me"], creditedUser);
      creditGamePointsBalanceToAuthSession(response.payout);
    },
  });

  return {
    betMutation,
    result,
    resultHistory,
  };
}