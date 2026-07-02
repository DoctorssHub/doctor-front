"use client";

import { useCallback } from "react";
import { useAuthSessionStore } from "@/features/auth";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { BetAmountField } from "@/shared/ui/game-sidebar";
import { usePlinkoBetAmount } from "../../model/usePlinkoBetAmount";
import { usePlinkoBalance } from "../../model/usePlinkoBalance";
import { useIsPlinkoStakeChangeDisabled } from "../../model/usePlinkoSidebarDisabledState";
import type { PlinkoBetBoundsProps } from "./PlinkoSidebar";

export function PlinkoBetAmountControl({
  maxBet,
  minBet,
}: PlinkoBetBoundsProps) {
  const showMaxControl = useGameSettingsStore(
    (state) => state.isMaxBetControlEnabled,
  );
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const { availableBalance } = usePlinkoBalance();
  const clearBetValidationError = usePlinkoBettingStore(
    (state) => state.clearBetValidationError,
  );
  const {
    betAmount,
    handleBetAmountBlur,
    handleBetAmountControlClick,
    setBetAmount,
  } = usePlinkoBetAmount({
    availableBalance,
    isAuthenticated,
    maxBet,
    minBet,
  });
  const isDisabled = useIsPlinkoStakeChangeDisabled();
  const handleBetAmountControlClickWithErrorClear = useCallback(
    (...args: Parameters<typeof handleBetAmountControlClick>) => {
      handleBetAmountControlClick(...args);
      clearBetValidationError();
    },
    [clearBetValidationError, handleBetAmountControlClick],
  );

  return (
    <BetAmountField
      betAmount={betAmount}
      gameBalance={availableBalance ?? 0}
      isDisabled={isDisabled}
      maxBet={maxBet}
      minBet={minBet}
      showMaxControl={showMaxControl}
      onBetAmountBlur={handleBetAmountBlur}
      onBetAmountChange={setBetAmount}
      onBetAmountControlClick={handleBetAmountControlClickWithErrorClear}
    />
  );
}
