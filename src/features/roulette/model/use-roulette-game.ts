import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
  const {
    addResultToHistory,
    clearBets,
    finishSpin,
    isSpinning,
    placeBet,
    placedBets,
    result,
    resultHistory,
    selectChip,
    selectedChip,
    settleResultHistory,
    startSpin,
    stopSpin,
    undoBet,
  } = useRouletteStore(
    useShallow((state) => ({
      addResultToHistory: state.addResultToHistory,
      clearBets: state.clearBets,
      finishSpin: state.finishSpin,
      isSpinning: state.isSpinning,
      placeBet: state.placeBet,
      placedBets: state.placedBets,
      result: state.result,
      resultHistory: state.resultHistory,
      selectChip: state.selectChip,
      selectedChip: state.selectedChip,
      settleResultHistory: state.settleResultHistory,
      startSpin: state.startSpin,
      stopSpin: state.stopSpin,
      undoBet: state.undoBet,
    })),
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
      autoBetting.stopAutoBetting();
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

  function handleSelectChip(chip: number) {
    gameSounds.playSelection();
    selectChip(chip);
  }

  function handlePlaceBet(bet: Parameters<typeof placeBet>[0]) {
    gameSounds.playChipPlacement(
      bet.kind === "straight" ? "straight" : "group",
    );

    placeBet(bet);
  }

  function handleClearBets() {
    gameSounds.playClear();
    clearBets();
  }

  function handleUndoBet() {
    gameSounds.playChipPlacement("straight");
    undoBet();
  }

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
      onClear: handleClearBets,
      onModeChange: setBetMode,
      onSelectChip: handleSelectChip,
      onSubmit: handleBetSubmit,
      onToggleAutoInfinite: autoBetting.handleToggleAutoInfinite,
      onUndo: handleUndoBet,
      selectedChip,
      totalBetAmount,
    },
    gamePanelProps: {
      canUndo: placedBets.length > 0,
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
      onClear: handleClearBets,
      onPlaceBet: handlePlaceBet,
      onSettleResultHistory: settleResultHistory,
      onUndo: handleUndoBet,
    },
  };
}
