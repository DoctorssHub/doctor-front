"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";
import { AutoBetControls } from "@/widgets/game-sidebar/ui/AutoBetControls";
import { BetAmountField } from "@/widgets/game-sidebar/ui/BetAmountField";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { ModeTabs } from "@/widgets/game-sidebar/ui/ModeTabs";
import { RiskSelector } from "@/widgets/game-sidebar/ui/RiskSelector";
import { RowsSlider } from "@/widgets/game-sidebar/ui/RowsSlider";
import { getBetButtonLabel } from "../lib/plinko-controls";
import { usePlinkoBetAmount } from "../model/usePlinkoBetAmount";
import { usePlinkoBalance } from "../model/usePlinkoBalance";
import { usePlinkoBetting } from "../model/usePlinkoBetting";

type PlinkoSidebarProps = {
  configErrorMessage?: string;
  hasGameConfigError: boolean;
  isGameConfigLoading: boolean;
  isGameConfigReady: boolean;
  maxBet: string;
  minBet: string;
};

type GameConfigStatusProps = Pick<
  PlinkoSidebarProps,
  "hasGameConfigError" | "isGameConfigLoading" | "isGameConfigReady"
>;

type BetBoundsProps = Pick<PlinkoSidebarProps, "maxBet" | "minBet">;

export function PlinkoSidebar({
  configErrorMessage,
  hasGameConfigError,
  isGameConfigLoading,
  isGameConfigReady,
  maxBet,
  minBet,
}: PlinkoSidebarProps) {
  return (
    <GameSidebar>
      <PlinkoModeControl />
      <PlinkoBetAmountControl maxBet={maxBet} minBet={minBet} />
      <PlinkoRiskControl />
      <PlinkoRowsControl />
      <PlinkoAutoBetSection />
      <PlinkoBetButton
        hasGameConfigError={hasGameConfigError}
        isGameConfigLoading={isGameConfigLoading}
        isGameConfigReady={isGameConfigReady}
        maxBet={maxBet}
        minBet={minBet}
      />
      <PlinkoBetError configErrorMessage={configErrorMessage} />
    </GameSidebar>
  );
}

function PlinkoModeControl() {
  const { mode, setMode } = usePlinkoControlsStore(
    useShallow((state) => ({
      mode: state.mode,
      setMode: state.setMode,
    })),
  );
  const isDisabled = useIsGameControlDisabled();

  return <ModeTabs isDisabled={isDisabled} mode={mode} onModeChange={setMode} />;
}

function PlinkoBetAmountControl({ maxBet, minBet }: BetBoundsProps) {
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const { availableBalance, balanceLabel } = usePlinkoBalance();
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
  const isDisabled = useIsStakeChangeDisabled();
  const handleBetAmountControlClickWithErrorClear = useCallback(
    (...args: Parameters<typeof handleBetAmountControlClick>) => {
      handleBetAmountControlClick(...args);
      clearBetValidationError();
    },
    [clearBetValidationError, handleBetAmountControlClick],
  );

  return (
    <BetAmountField
      balanceLabel={balanceLabel}
      betAmount={betAmount}
      isDisabled={isDisabled}
      maxBet={maxBet}
      minBet={minBet}
      onBetAmountBlur={handleBetAmountBlur}
      onBetAmountChange={setBetAmount}
      onBetAmountControlClick={handleBetAmountControlClickWithErrorClear}
    />
  );
}

function PlinkoRiskControl() {
  const { risk, setRisk } = usePlinkoControlsStore(
    useShallow((state) => ({
      risk: state.risk,
      setRisk: state.setRisk,
    })),
  );
  const isDisabled = useIsGameControlDisabled();

  return (
    <RiskSelector
      isDisabled={isDisabled}
      onRiskChange={setRisk}
      risk={risk}
    />
  );
}

function PlinkoRowsControl() {
  const { rows, setRows } = usePlinkoControlsStore(
    useShallow((state) => ({
      rows: state.rows,
      setRows: state.setRows,
    })),
  );
  const isDisabled = useIsGameControlDisabled();

  return (
    <RowsSlider
      isDisabled={isDisabled}
      onChange={setRows}
      value={rows}
    />
  );
}

function PlinkoAutoBetSection() {
  const {
    autoBetsAmount,
    isAutoBetsInfinite,
    mode,
    setAutoBetsAmount,
    toggleAutoBetsInfinite,
  } = usePlinkoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      mode: state.mode,
      setAutoBetsAmount: state.setAutoBetsAmount,
      toggleAutoBetsInfinite: state.toggleAutoBetsInfinite,
    })),
  );
  const isDisabled = useIsStakeChangeDisabled();

  if (mode !== "Auto") {
    return null;
  }

  return (
    <AutoBetControls
      autoBetsAmount={autoBetsAmount}
      isAutoBetsInfinite={isAutoBetsInfinite}
      isDisabled={isDisabled}
      onAutoBetsAmountChange={setAutoBetsAmount}
      onAutoBetsInfinityToggle={toggleAutoBetsInfinite}
    />
  );
}

function PlinkoBetButton({
  hasGameConfigError,
  isGameConfigLoading,
  isGameConfigReady,
  maxBet,
  minBet,
}: GameConfigStatusProps & BetBoundsProps) {
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
    <button
      className="mt-8 h-12 rounded-md bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60 max-[1023px]:order-1 max-[1023px]:mt-0"
      disabled={
        isBetting ||
        (isAuthenticated && (isGameConfigLoading || hasGameConfigError))
      }
      onClick={handleBetClick}
      type="button"
    >
      {getBetButtonLabel({
        hasConfigError: hasGameConfigError,
        isAuthenticated,
        isAutoBetStopRequested,
        isAutoBetting,
        isBetting,
        isConfigLoading: isGameConfigLoading,
        mode,
      })}
    </button>
  );
}

function PlinkoBetError({
  configErrorMessage,
}: Pick<PlinkoSidebarProps, "configErrorMessage">) {
  const betValidationError = usePlinkoBettingStore(
    (state) => state.betValidationError,
  );
  const errorMessage = betValidationError || configErrorMessage;

  return errorMessage ? (
    <p className="mt-3 text-sm leading-5 text-[#f87171] max-[1023px]:order-2">
      {errorMessage}
    </p>
  ) : null;
}

function useIsGameControlDisabled() {
  const isAutoBetting = usePlinkoBettingStore(
    (state) => state.isAutoBetting,
  );
  const isRoundInFlight = usePlinkoRoundsStore(
    (state) => state.activeRounds.length > 0,
  );

  return isAutoBetting || isRoundInFlight;
}

function useIsStakeChangeDisabled() {
  const { isAutoBetting, isBetting } = usePlinkoBettingStore(
    useShallow((state) => ({
      isAutoBetting: state.isAutoBetting,
      isBetting: state.isBetting,
    })),
  );
  const isRoundInFlight = usePlinkoRoundsStore(
    (state) => state.activeRounds.length > 0,
  );

  return isAutoBetting || isBetting || isRoundInFlight;
}
