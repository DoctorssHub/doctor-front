import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { getRouletteConfig, placeRouletteBet } from "../api/roulette-api";
import type {
  RouletteBetRequest,
  RouletteBetResponse,
} from "../api/roulette-types";
import {
  applyRouletteBalanceResult,
  getGamePointsBalance,
} from "../lib/roulette-balance";
import { getRouletteErrorMessage } from "../lib/roulette-errors";
import {
  buildRouletteBetPayload,
  getPlacedBetsTotal,
} from "./roulette-bets";
import { useAutoRouletteBetting } from "./use-auto-roulette-betting";
import { useRouletteStore } from "./use-roulette-store";

type RouletteBetMutationVariables = {
  payload: RouletteBetRequest;
  clearBetsOnSuccess: boolean;
};

export function useRouletteGame() {
  const queryClient = useQueryClient();
  const [betMode, setBetMode] = useState<"manual" | "auto">("manual");
  const [isResultAnimating, setIsResultAnimating] = useState(false);
  const [isWinModalVisible, setIsWinModalVisible] = useState(false);
  const selectedChip = useRouletteStore((state) => state.selectedChip);
  const placedBets = useRouletteStore((state) => state.placedBets);
  const isSpinning = useRouletteStore((state) => state.isSpinning);
  const result = useRouletteStore((state) => state.result);
  const resultHistory = useRouletteStore((state) => state.resultHistory);
  const selectChip = useRouletteStore((state) => state.selectChip);
  const placeBet = useRouletteStore((state) => state.placeBet);
  const clearBets = useRouletteStore((state) => state.clearBets);
  const undoBet = useRouletteStore((state) => state.undoBet);
  const startSpin = useRouletteStore((state) => state.startSpin);
  const finishSpin = useRouletteStore((state) => state.finishSpin);
  const stopSpin = useRouletteStore((state) => state.stopSpin);
  const addResultToHistory = useRouletteStore(
    (state) => state.addResultToHistory,
  );
  const settleResultHistory = useRouletteStore(
    (state) => state.settleResultHistory,
  );
  const autoBetting = useAutoRouletteBetting();

  const configQuery = useQuery({
    queryKey: ["roulette", "config"],
    queryFn: async () => (await getRouletteConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  const handleLandingComplete = useCallback(() => {
    addResultToHistory();
    setIsResultAnimating(false);
    setIsWinModalVisible(result !== null && Number(result.payout) > 0);
  }, [addResultToHistory, result]);

  useEffect(() => {
    if (!isWinModalVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsWinModalVisible(false);
    }, 2000);

    function dismissWinModal() {
      setIsWinModalVisible(false);
    }

    document.addEventListener("pointerdown", dismissWinModal);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("pointerdown", dismissWinModal);
    };
  }, [isWinModalVisible]);

  const betMutation = useMutation<
    RouletteBetResponse,
    Error,
    RouletteBetMutationVariables
  >({
    mutationFn: async ({ payload }) => {
      return (await placeRouletteBet(payload)).data;
    },
    onMutate: () => {
      setIsWinModalVisible(false);
      startSpin();
    },
    onError: () => {
      autoBetting.stopAutoBetting();
      setIsResultAnimating(false);
      stopSpin();
    },
    onSuccess: (response, variables) => {
      setIsResultAnimating(true);
      finishSpin(response, { clearBets: variables.clearBetsOnSuccess });
      queryClient.setQueryData<MeResponse>(["me"], (user) =>
        applyRouletteBalanceResult(user, response),
      );

      autoBetting.scheduleNextAutoBet((nextVariables) => {
        betMutation.mutate(nextVariables);
      });
    },
  });

  const totalBetAmount = getPlacedBetsTotal(placedBets);
  const gameBalance = getGamePointsBalance(meQuery.data);
  const minBet = configQuery.data?.minBet ?? 1;
  const maxBet = configQuery.data?.maxBet ?? 100000;
  const errorMessage = betMutation.error
    ? getRouletteErrorMessage(betMutation.error)
    : configQuery.error || meQuery.error
      ? "Unable to load game data"
      : null;

  function handleBetSubmit() {
    if (autoBetting.isAutoRunning) {
      autoBetting.stopAutoBetting();

      return;
    }

    const payload = buildRouletteBetPayload(placedBets);

    if (betMode === "auto") {
      betMutation.mutate(autoBetting.startAutoBetting(payload));

      return;
    }

    betMutation.mutate({ clearBetsOnSuccess: false, payload });
  }

  return {
    betControlsProps: {
      autoBetCount: autoBetting.autoBetCount,
      canUndo: placedBets.length > 0,
      errorMessage,
      gameBalance,
      isAutoInfinite: autoBetting.isAutoInfinite,
      isAutoRunning: autoBetting.isAutoRunning,
      isAnimating: isResultAnimating,
      isSpinning,
      isSubmitting: betMutation.isPending,
      maxBet,
      minBet,
      mode: betMode,
      onAutoBetCountChange: autoBetting.handleAutoBetCountChange,
      onClear: clearBets,
      onModeChange: setBetMode,
      onSelectChip: selectChip,
      onSubmit: handleBetSubmit,
      onToggleAutoInfinite: autoBetting.handleToggleAutoInfinite,
      onUndo: undoBet,
      selectedChip,
      totalBetAmount,
    },
    gamePanelProps: {
      disabled:
        autoBetting.isAutoRunning ||
        isSpinning ||
        betMutation.isPending ||
        isResultAnimating,
      isResultAnimating,
      isWinModalVisible,
      isWheelSpinning: isSpinning || betMutation.isPending,
      placedBets,
      result,
      resultHistory,
      onLandingComplete: handleLandingComplete,
      onPlaceBet: placeBet,
      onSettleResultHistory: settleResultHistory,
    },
  };
}
