import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
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
import { buildRouletteBetPayload } from "./roulette-bets";
import { useAutoRouletteBetting } from "./use-auto-roulette-betting";
import { useRouletteStore } from "./use-roulette-store";

type RouletteBetMutationVariables = {
  payload: RouletteBetRequest;
  clearBetsOnSuccess: boolean;
};

export function useRouletteGame() {
  const queryClient = useQueryClient();
  const betModeRef = useRef<"manual" | "auto">("manual");
  const [isResultAnimating, setIsResultAnimating] = useState(false);
  const [isWinModalVisible, setIsWinModalVisible] = useState(false);
  const {
    addResultToHistory,
    finishSpin,
    isSpinning,
    result,
    resultHistory,
    settleResultHistory,
    startSpin,
    stopSpin,
  } = useRouletteStore(
    useShallow((state) => ({
      addResultToHistory: state.addResultToHistory,
      finishSpin: state.finishSpin,
      isSpinning: state.isSpinning,
      result: state.result,
      resultHistory: state.resultHistory,
      settleResultHistory: state.settleResultHistory,
      startSpin: state.startSpin,
      stopSpin: state.stopSpin,
    })),
  );
  const autoBetting = useAutoRouletteBetting();
  const {
    autoBetCount,
    handleAutoBetCountChange,
    handleToggleAutoInfinite,
    isAutoInfinite,
    isAutoRunning,
    scheduleNextAutoBet,
    startAutoBetting,
    stopAutoBetting,
  } = autoBetting;

  const configQuery = useQuery({
    queryKey: ["roulette", "config"],
    queryFn: async () => (await getRouletteConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  const handleLandingComplete = useCallback(() => {
    const didWin = result !== null && Number(result.payout) > 0;

    gameSounds.stop("roulette");

    gameSounds.playResult({ didWin, lossSound: "pocket" });

    addResultToHistory();
    setIsResultAnimating(false);
    setIsWinModalVisible(didWin);
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
      gameSounds.playBetStart("roulette");
      setIsWinModalVisible(false);
      startSpin();
    },
    onError: () => {
      stopAutoBetting();
      gameSounds.stop("roulette");
      setIsResultAnimating(false);
      stopSpin();
    },
    onSuccess: (response, variables) => {
      setIsResultAnimating(true);
      finishSpin(response, { clearBets: variables.clearBetsOnSuccess });
      queryClient.setQueryData<MeResponse>(["me"], (user) =>
        applyRouletteBalanceResult(user, response),
      );

      scheduleNextAutoBet((nextVariables) => {
        betMutation.mutate(nextVariables);
      });
    },
  });

  const mutateRouletteBet = betMutation.mutate;

  const gameBalance = getGamePointsBalance(meQuery.data);
  const minBet = configQuery.data?.minBet ?? 1;
  const maxBet = configQuery.data?.maxBet ?? 100000;
  const errorMessage = betMutation.error
    ? getRouletteErrorMessage(betMutation.error)
    : configQuery.error || meQuery.error
      ? "Unable to load game data"
      : null;


  const handleModeChange = useCallback((mode: "manual" | "auto") => {
    betModeRef.current = mode;
  }, []);

  const handleBetSubmit = useCallback(() => {
    const betMode = betModeRef.current;

    const placedBets = useRouletteStore.getState().placedBets;

    if (isAutoRunning) {
      stopAutoBetting();

      return;
    }

    const payload = buildRouletteBetPayload(placedBets);

    if (betMode === "auto") {
      mutateRouletteBet(startAutoBetting(payload));

      return;
    }

    mutateRouletteBet({ clearBetsOnSuccess: false, payload });
  }, [
    isAutoRunning,
    mutateRouletteBet,
    startAutoBetting,
    stopAutoBetting,
  ]);

  return {
    betControlsProps: {
      autoBetCount,
      errorMessage,
      gameBalance,
      isAutoInfinite,
      isAutoRunning,
      isAnimating: isResultAnimating,
      isSpinning,
      isSubmitting: betMutation.isPending,
      maxBet,
      minBet,
      onAutoBetCountChange: handleAutoBetCountChange,
      onModeChange: handleModeChange,
      onSubmit: handleBetSubmit,
      onToggleAutoInfinite: handleToggleAutoInfinite,
    },
    gamePanelProps: {
      disabled:
        isAutoRunning ||
        isSpinning ||
        betMutation.isPending ||
        isResultAnimating,
      isResultAnimating,
      isWinModalVisible,
      isWheelSpinning: isSpinning || betMutation.isPending,
      result,
      resultHistory,
      onLandingComplete: handleLandingComplete,
      onSettleResultHistory: settleResultHistory,
    },
  };
}
