"use client";

import { useCallback, useState } from "react";
import type { GameMode, Risk } from "@/entities/game/model/types";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { RiskSelector } from "@/widgets/game-sidebar/ui/RiskSelector";
import { RowsSlider } from "@/widgets/game-sidebar/ui/RowsSlider";
import { PlinkoBoard } from "@/widgets/plinko-board/ui/PlinkoBoard";
import { getBetButtonLabel } from "../lib/plinko-controls";
import { usePlinkoBalance } from "../model/usePlinkoBalance";
import { usePlinkoBetAmount } from "../model/usePlinkoBetAmount";
import { usePlinkoBetting } from "../model/usePlinkoBetting";
import { usePlinkoConfig } from "../model/usePlinkoConfig";
import { usePlinkoRounds } from "../model/usePlinkoRounds";

export function PlinkoScreen() {
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const {
    availableBalance,
    balanceLabel,
    balanceType,
  } = usePlinkoBalance();
  const {
    config: plinkoConfig,
    errorMessage: configErrorMessage,
    hasError: hasGameConfigError,
    isLoading: isGameConfigLoading,
    isReady: isGameConfigReady,
  } = usePlinkoConfig();
  const [mode, setMode] = useState<GameMode>("Manual");
  const [risk, setRisk] = useState<Risk>("LOW");
  const [rows, setRows] = useState(8);
  const [isAutoBetsInfinite, setIsAutoBetsInfinite] = useState(false);
  const {
    activeRounds,
    addRound,
    handleRoundAnimationComplete,
    isRoundInFlight,
    recentMultipliers,
  } = usePlinkoRounds();
  const {
    betAmount,
    handleBetAmountBlur,
    handleBetAmountControlClick,
    readCurrentBetAmount,
    setBetAmount,
    validateBetAmount,
  } = usePlinkoBetAmount({
    availableBalance,
    isAuthenticated,
    maxBet: plinkoConfig.maxBet,
    minBet: plinkoConfig.minBet,
  });
  const {
    autoBetsAmount,
    betValidationError,
    clearBetValidationError,
    handleBetClick,
    isAutoBetStopRequested,
    isAutoBetting,
    isBetting,
    setAutoBetsAmount,
  } = usePlinkoBetting({
    addRound,
    availableBalance,
    balanceType,
    isAuthenticated,
    isAutoBetsInfinite,
    isGameConfigReady,
    mode,
    onAuthRequired: () => openAuthModal("login"),
    readCurrentBetAmount,
    risk,
    rows,
    validateBetAmount,
  });
  const isGameControlDisabled = isAutoBetting || isRoundInFlight;
  // Lock the stake inputs while a bet/round is in flight: a running autobet loop
  // uses the amount and count captured when it started, so editing them mid-run
  // would only mislead the player.
  const isStakeChangeDisabled =
    isAutoBetting || isBetting || isRoundInFlight;
  const handleBetAmountControlClickWithErrorClear = useCallback(
    (...args: Parameters<typeof handleBetAmountControlClick>) => {
      handleBetAmountControlClick(...args);
      clearBetValidationError();
    },
    [clearBetValidationError, handleBetAmountControlClick],
  );

  return (
    <main className="bg-[#080c17] p-4 text-white max-[767px]:p-2 md:p-5">
      <section className="mx-auto flex min-h-[524px] max-w-[60rem] flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0_/_28%)] min-[1024px]:flex-row max-[1023px]:min-h-0">
        <GameSidebar
          autoBetsAmount={autoBetsAmount}
          balanceLabel={balanceLabel}
          betAmount={betAmount}
          betButtonLabel={getBetButtonLabel({
            hasConfigError: hasGameConfigError,
            isAuthenticated,
            isAutoBetStopRequested,
            isAutoBetting,
            isBetting,
            isConfigLoading: isGameConfigLoading,
            mode,
          })}
          errorMessage={betValidationError || configErrorMessage}
          isAutoBetChangeDisabled={isStakeChangeDisabled}
          isBetAmountChangeDisabled={isStakeChangeDisabled}
          isBetDisabled={
            isBetting ||
            (isAuthenticated && (isGameConfigLoading || hasGameConfigError))
          }
          isAutoBetsInfinite={isAutoBetsInfinite}
          isModeChangeDisabled={isGameControlDisabled}
          maxBet={plinkoConfig.maxBet}
          minBet={plinkoConfig.minBet}
          mode={mode}
          onAutoBetsAmountChange={setAutoBetsAmount}
          onAutoBetsInfinityToggle={() =>
            setIsAutoBetsInfinite((current) => !current)
          }
          onBetAmountChange={setBetAmount}
          onBetAmountBlur={handleBetAmountBlur}
          onBetAmountControlClick={handleBetAmountControlClickWithErrorClear}
          onBetClick={() => handleBetClick(betAmount)}
          onModeChange={setMode}
        >
          <RiskSelector
            isDisabled={isGameControlDisabled}
            onRiskChange={setRisk}
            risk={risk}
          />
          <RowsSlider
            isDisabled={isGameControlDisabled}
            onChange={setRows}
            value={rows}
          />
        </GameSidebar>
        <PlinkoBoard
          activeRounds={activeRounds}
          config={plinkoConfig}
          onRoundAnimationComplete={handleRoundAnimationComplete}
          recentMultipliers={recentMultipliers}
          risk={risk}
          rows={rows}
        />
      </section>
    </main>
  );
}
