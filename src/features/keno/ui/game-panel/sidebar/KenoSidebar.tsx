"use client";

import { memo, useCallback } from "react";
import {
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
  type BetAmountControl,
} from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import {
  AutoBetControls,
  BetAmountField,
  GameBetButton,
  GameSidebar,
  ModeTabs,
  RiskSelector,
} from "@/shared/ui/game-sidebar/ui";
import { getKenoBetButtonLabel } from "../../../lib/keno-bet-label";
import { type KenoRisk } from "../../../model/keno-controls-store";
import { KenoActionButtons } from "./KenoActionButtons";
import { useKenoSidebarControls } from "./useKenoSidebarControls";

const kenoRiskOptions: Array<{
  label: string;
  toneClassName: string;
  value: KenoRisk;
}> = [
  { label: "Classic", toneClassName: "text-[#3b82f6]", value: "CLASSIC" },
  { label: "Low", toneClassName: "text-[#22c55e]", value: "LOW" },
  { label: "Medium", toneClassName: "text-[#facc15]", value: "MEDIUM" },
  { label: "High", toneClassName: "text-[#ef4444]", value: "HIGH" },
];

type KenoSidebarProps = {
  errorMessage: string | null;
  gameBalance: number;
  isAutoBetStopRequested: boolean;
  isAutoBetting: boolean;
  isBetting: boolean;
  isGameUnavailable: boolean;
  isInteractionLocked: boolean;
  isLoadingGameData: boolean;
  maxBet: number;
  minBet: number;
  isRevealingResults: boolean;
  onResultsReset: () => void;
  onSubmit: () => void;
};

export const KenoSidebar = memo(function KenoSidebar({
  errorMessage,
  gameBalance,
  isAutoBetStopRequested,
  isAutoBetting,
  isBetting,
  isGameUnavailable,
  isInteractionLocked,
  isLoadingGameData,
  maxBet,
  minBet,
  isRevealingResults,
  onResultsReset,
  onSubmit,
}: KenoSidebarProps) {
  const {
    autoBetsAmount,
    betAmount,
    hasSelectedNumbers,
    isAutoBetsInfinite,
    mode,
    risk,
    setAutoBetsAmount,
    setBetAmount,
    setMode,
    setRisk,
    toggleAutoBetsInfinite,
  } = useKenoSidebarControls();
  const parsedBetAmount = readBetAmount(betAmount);
  const maxBetAmount = Math.min(maxBet, gameBalance);
  const isBetAmountInvalid =
    parsedBetAmount === null ||
    parsedBetAmount < minBet ||
    parsedBetAmount > maxBetAmount;
  const amountErrorMessage =
    parsedBetAmount !== null && parsedBetAmount < minBet
      ? `Minimum bet is ${minBet.toFixed(2)}`
      : parsedBetAmount !== null && parsedBetAmount > maxBet
        ? `Maximum bet is ${maxBet.toFixed(2)}`
        : parsedBetAmount !== null && parsedBetAmount > gameBalance
          ? "Not enough coins"
          : null;
  const sidebarErrorMessage = amountErrorMessage ?? errorMessage;
  const isBetDisabled = isAutoBetting
    ? isAutoBetStopRequested
    : isBetAmountInvalid ||
      !hasSelectedNumbers ||
      isLoadingGameData ||
      isBetting ||
      isRevealingResults ||
      isGameUnavailable;
  const betButtonLabel = getKenoBetButtonLabel({
    isAutoBetStopRequested,
    isAutoBetting,
    isAutoMode: mode === "Auto",
    isBetting,
  });
  const handleBetAmountBlur = useCallback(() => {
    setBetAmount(formatBetAmountInput(betAmount));
  }, [betAmount, setBetAmount]);
  const handleBetAmountControlClick = useCallback(
    (control: BetAmountControl) => {
      setBetAmount((amount) =>
        getNextBetAmount(amount, control, {
          availableBalance: gameBalance,
          maxBet: String(maxBet),
          minBet: String(minBet),
        }),
      );
    },
    [gameBalance, maxBet, minBet, setBetAmount],
  );

  return (
    <GameSidebar>
      <ModeTabs
        className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold max-[1023px]:order-7 max-[1023px]:mt-6"
        isDisabled={isInteractionLocked}
        mode={mode}
        onModeChange={setMode}
      />
      <BetAmountField
        betAmount={betAmount}
        gameBalance={gameBalance}
        isDisabled={isInteractionLocked}
        maxBet={String(maxBet)}
        minBet={String(minBet)}
        showBalance={false}
        onBetAmountBlur={handleBetAmountBlur}
        onBetAmountChange={setBetAmount}
        onBetAmountControlClick={handleBetAmountControlClick}
      />
      <RiskSelector<KenoRisk>
        isDisabled={isInteractionLocked}
        onRiskChange={setRisk}
        options={kenoRiskOptions}
        risk={risk}
      />
      {mode === "Auto" ? (
        <AutoBetControls
          autoBetsAmount={autoBetsAmount}
          isAutoBetsInfinite={isAutoBetsInfinite}
          isDisabled={isInteractionLocked}
          onAutoBetsAmountChange={setAutoBetsAmount}
          onAutoBetsInfinityToggle={toggleAutoBetsInfinite}
        />
      ) : null}
      <KenoActionButtons
        isInteractionLocked={isInteractionLocked}
        onResultsReset={onResultsReset}
      />
      {sidebarErrorMessage ? (
        <p className="mt-2 text-xs font-medium text-red-400" role="alert">
          {sidebarErrorMessage}
        </p>
      ) : null}
      <GameBetButton
        className="mt-3 max-[1023px]:order-1 max-[1023px]:mt-0"
        disabled={isBetDisabled}
        isLoading={isBetting && betButtonLabel !== "Stop Autobet"}
        label={betButtonLabel}
        onClick={onSubmit}
      />
    </GameSidebar>
  );
});
