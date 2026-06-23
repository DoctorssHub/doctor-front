"use client";

import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import {
  AutoBetControls,
  BetAmountField,
  GameBetButton,
  GameSidebar,
  ModeTabs,
  RiskSelector,
} from "@/widgets/game-sidebar/ui";
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
  betAmount: string;
  betButtonLabel: string;
  errorMessage: string | null;
  gameBalance: number;
  isBetDisabled: boolean;
  isBetting: boolean;
  isInteractionLocked: boolean;
  onBetAmountBlur: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
  onResultsReset: () => void;
  onSubmit: () => void;
};

export function KenoSidebar({
  betAmount,
  betButtonLabel,
  errorMessage,
  gameBalance,
  isBetDisabled,
  isBetting,
  isInteractionLocked,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
  onResultsReset,
  onSubmit,
}: KenoSidebarProps) {
  const {
    autoBetsAmount,
    autoPickNumbers,
    handleClearTable,
    isAutoBetsInfinite,
    isAutoPicking,
    mode,
    risk,
    selectedNumbersCount,
    setAutoBetsAmount,
    setMode,
    setRisk,
    toggleAutoBetsInfinite,
  } = useKenoSidebarControls(onResultsReset);

  return (
    <GameSidebar>
      <ModeTabs
        buttonClassName="flex h-12 items-center justify-center rounded-lg px-4 text-sm font-medium"
        className="grid grid-cols-2 gap-3 max-[1023px]:order-7 max-[1023px]:mt-6"
        isDisabled={isInteractionLocked}
        mode={mode}
        onModeChange={setMode}
      />
      <BetAmountField
        betAmount={betAmount}
        gameBalance={gameBalance}
        isDisabled={isInteractionLocked}
        showBalance={false}
        onBetAmountBlur={onBetAmountBlur}
        onBetAmountChange={onBetAmountChange}
        onBetAmountControlClick={onBetAmountControlClick}
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
        isAutoPicking={isAutoPicking}
        isInteractionLocked={isInteractionLocked}
        onAutoPick={() => {
          void autoPickNumbers();
        }}
        onClearTable={handleClearTable}
        selectedNumbersCount={selectedNumbersCount}
      />
      {errorMessage ? (
        <p className="mt-2 text-xs font-medium text-red-400" role="alert">
          {errorMessage}
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
}
