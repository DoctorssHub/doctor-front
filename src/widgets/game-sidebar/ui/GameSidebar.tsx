"use client";

import type { GameMode, Risk } from "@/entities/game/model/types";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import { AutoBetControls } from "./AutoBetControls";
import { BetAmountField } from "./BetAmountField";
import { ModeTabs } from "./ModeTabs";
import { RiskSelector } from "./RiskSelector";
import { RowsSlider } from "./RowsSlider";

type GameSidebarProps = {
  autoBetsAmount: string;
  balanceLabel?: string;
  betAmount: string;
  betButtonLabel?: string;
  errorMessage?: string;
  isAutoBetChangeDisabled?: boolean;
  isAutoBetsInfinite: boolean;
  isBetAmountChangeDisabled?: boolean;
  isBetDisabled?: boolean;
  isModeChangeDisabled?: boolean;
  isRiskChangeDisabled?: boolean;
  isRowsChangeDisabled?: boolean;
  maxBet?: string;
  minBet?: string;
  mode: GameMode;
  onAutoBetsAmountChange: (amount: string) => void;
  onAutoBetsInfinityToggle: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountBlur: () => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
  onBetClick: () => void;
  onModeChange: (mode: GameMode) => void;
  onRiskChange: (risk: Risk) => void;
  onRowsChange: (rows: number) => void;
  risk: Risk;
  rows: number;
};

export function GameSidebar({
  autoBetsAmount,
  balanceLabel,
  betAmount,
  betButtonLabel = "Bet",
  errorMessage,
  isAutoBetChangeDisabled = false,
  isAutoBetsInfinite,
  isBetAmountChangeDisabled = false,
  isBetDisabled = false,
  isModeChangeDisabled = false,
  isRiskChangeDisabled = false,
  isRowsChangeDisabled = false,
  maxBet,
  minBet,
  mode,
  onAutoBetsAmountChange,
  onAutoBetsInfinityToggle,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
  onBetClick,
  onModeChange,
  onRiskChange,
  onRowsChange,
  risk,
  rows,
}: GameSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#0E121C] px-5 py-6 min-[1024px]:w-[330px] min-[1024px]:px-7 max-[1023px]:order-2 max-[1023px]:border-t max-[1023px]:border-[#111827] max-[767px]:px-4 max-[767px]:py-5">
      <ModeTabs
        isDisabled={isModeChangeDisabled}
        mode={mode}
        onModeChange={onModeChange}
      />

      <BetAmountField
        balanceLabel={balanceLabel}
        betAmount={betAmount}
        isDisabled={isBetAmountChangeDisabled}
        maxBet={maxBet}
        minBet={minBet}
        onBetAmountBlur={onBetAmountBlur}
        onBetAmountChange={onBetAmountChange}
        onBetAmountControlClick={onBetAmountControlClick}
      />

      <RiskSelector
        isDisabled={isRiskChangeDisabled}
        onRiskChange={onRiskChange}
        risk={risk}
      />

      <RowsSlider
        isDisabled={isRowsChangeDisabled}
        onRowsChange={onRowsChange}
        rows={rows}
      />

      {mode === "Auto" ? (
        <AutoBetControls
          autoBetsAmount={autoBetsAmount}
          isAutoBetsInfinite={isAutoBetsInfinite}
          isDisabled={isAutoBetChangeDisabled}
          onAutoBetsAmountChange={onAutoBetsAmountChange}
          onAutoBetsInfinityToggle={onAutoBetsInfinityToggle}
        />
      ) : null}

      <button
        className="mt-8 h-12 rounded-md bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60 max-[1023px]:order-1 max-[1023px]:mt-0"
        disabled={isBetDisabled}
        onClick={onBetClick}
        type="button"
      >
        {betButtonLabel}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-sm leading-5 text-[#f87171] max-[1023px]:order-2">
          {errorMessage}
        </p>
      ) : null}
    </aside>
  );
}
