"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { GameBetButton } from "@/shared/ui/game-sidebar";
import { getBetButtonLabel } from "../../lib/plinko-controls";
import { usePlinkoBalance } from "../../model/usePlinkoBalance";
import { usePlinkoBetting } from "../../model/usePlinkoBetting";
import type {
  PlinkoBetBoundsProps,
  PlinkoGameConfigStatusProps,
} from "./PlinkoSidebar";

export function PlinkoBetButton({
  hasGameConfigError,
  isGameConfigLoading,
  isGameConfigReady,
  maxBet,
  minBet,
}: PlinkoGameConfigStatusProps & PlinkoBetBoundsProps) {
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const addRound = usePlinkoRoundsStore((state) => state.addRound);
  const mode = usePlinkoControlsStore((state) => state.mode);
  const {
    isAutoBetStopRequested,
    isAutoBetting,
    isBetting,
  } = usePlinkoBettingStore(
    useShallow((state) => ({
      isAutoBetStopRequested: state.isAutoBetStopRequested,
      isAutoBetting: state.isAutoBetting,
      isBetting: state.isBetting,
    })),
  );
  const { availableBalance, balanceType } = usePlinkoBalance();
  const handleAuthRequired = useCallback(() => {
    openAuthModal("login");
  }, [openAuthModal]);
  const { handleBetClick } = usePlinkoBetting({
    addRound,
    availableBalance,
    balanceType,
    isAuthenticated,
    isGameConfigReady,
    maxBet,
    minBet,
    onAuthRequired: handleAuthRequired,
  });

  return (
    <GameBetButton
      className="mt-8 max-laptop:order-1 max-laptop:mt-0"
      disabled={
        isBetting ||
        (isAuthenticated && (isGameConfigLoading || hasGameConfigError))
      }
      label={getBetButtonLabel({
        hasConfigError: hasGameConfigError,
        isAuthenticated,
        isAutoBetStopRequested,
        isAutoBetting,
        isBetting,
        isConfigLoading: isGameConfigLoading,
        mode,
      })}
      onClick={handleBetClick}
    />
  );
}
