"use client";

import { useShallow } from "zustand/react/shallow";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import {
  AutoBetControls,
  BetAmountField,
  GameBetButton,
  GameSidebar,
  ModeTabs,
  RiskSelector,
} from "@/widgets/game-sidebar/ui";
import { KENO_MAX_SELECTION } from "../../model/keno-constants";
import {
  type KenoRisk,
  useKenoControlsStore,
} from "../../model/keno-controls-store";

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
    clearNumbers,
    isAutoBetsInfinite,
    isAutoPicking,
    mode,
    risk,
    selectedNumbersCount,
    setAutoBetsAmount,
    setMode,
    setRisk,
    toggleAutoBetsInfinite,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      autoPickNumbers: state.autoPickNumbers,
      clearNumbers: state.clearNumbers,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      isAutoPicking: state.isAutoPicking,
      mode: state.mode,
      risk: state.risk,
      selectedNumbersCount: state.selectedNumbers.length,
      setAutoBetsAmount: state.setAutoBetsAmount,
      setMode: state.setMode,
      setRisk: state.setRisk,
      toggleAutoBetsInfinite: state.toggleAutoBetsInfinite,
    })),
  );

  function handleClearTable() {
    clearNumbers();
    onResultsReset();
  }

  return (
    <GameSidebar>
      <ModeTabs
        buttonClassName="flex h-12 items-center justify-center rounded-lg px-4 text-sm font-medium"
        className="grid grid-cols-2 gap-3"
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
      <div className="mt-8 grid grid-cols-2 gap-2">
        <button
          className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white/70 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:text-white/30"
          disabled={
            isAutoPicking || isInteractionLocked || selectedNumbersCount === 0
          }
          onClick={handleClearTable}
          type="button"
        >
          Clear Table
        </button>
        <button
          className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-wait disabled:text-white/40"
          disabled={
            isAutoPicking ||
            isInteractionLocked ||
            selectedNumbersCount >= KENO_MAX_SELECTION
          }
          onClick={() => {
            void autoPickNumbers();
          }}
          type="button"
        >
          Auto Pick
        </button>
      </div>
      {errorMessage ? (
        <p className="mt-2 text-xs font-medium text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <GameBetButton
        className="mt-3"
        disabled={isBetDisabled}
        isLoading={isBetting && betButtonLabel !== "Stop Autobet"}
        label={betButtonLabel}
        onClick={onSubmit}
      />
    </GameSidebar>
  );
}
