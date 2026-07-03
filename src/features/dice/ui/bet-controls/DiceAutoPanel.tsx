import { AutoBetControls } from "@/shared/ui/game-sidebar/ui/AutoBetControls";
import type { DiceAutoConfig } from "../../model/dice-game-options";
import { AutoSummaryCard } from "./AutoSummaryCard";
import { DiceAutoConfigModal } from "./DiceAutoConfigModal";

type DiceAutoPanelProps = {
  autoBetCount: string;
  autoConfig: DiceAutoConfig;
  isAutoConfigOpen: boolean;
  isAutoInfinite: boolean;
  isLoading: boolean;
  onAutoBetCountChange: (amount: string) => void;
  onAutoConfigApply: () => void;
  onAutoConfigChange: (config: DiceAutoConfig) => void;
  onAutoConfigClose: () => void;
  onAutoConfigOpen: () => void;
  onAutoConfigResetAll: () => void;
  onToggleAutoInfinite: () => void;
};

export function DiceAutoPanel({
  autoBetCount,
  autoConfig,
  isAutoConfigOpen,
  isAutoInfinite,
  isLoading,
  onAutoBetCountChange,
  onAutoConfigApply,
  onAutoConfigChange,
  onAutoConfigClose,
  onAutoConfigOpen,
  onAutoConfigResetAll,
  onToggleAutoInfinite,
}: DiceAutoPanelProps) {
  return (
    <div className="dice-mode-panel" key="dice-auto-panel">
      <AutoBetControls
        autoBetsAmount={autoBetCount}
        className="mt-5 block text-sm font-medium text-[var(--color-text-primary)]"
        id="dice-auto-bet-count"
        inputMode="numeric"
        isAutoBetsInfinite={isAutoInfinite}
        isDisabled={isLoading}
        isInputDisabled={isLoading}
        onAutoBetsAmountChange={onAutoBetCountChange}
        onAutoBetsInfinityToggle={onToggleAutoInfinite}
      />

      <div className="mt-6 grid grid-cols-2 gap-1">
        <AutoSummaryCard
          label="On Win"
          value={formatAutoModeValue(
            autoConfig.onWinMode,
            autoConfig.onWinIncrease,
          )}
        />
        <AutoSummaryCard
          label="On Loss"
          value={formatAutoModeValue(
            autoConfig.onLossMode,
            autoConfig.onLossIncrease,
          )}
        />
        <AutoSummaryCard
          coin
          label="Stop on Profit"
          value={autoConfig.stopOnProfit}
        />
        <AutoSummaryCard
          coin
          label="Stop on Loss"
          value={autoConfig.stopOnLoss}
        />
      </div>

      <button
        className="mt-6 h-12 w-full rounded-lg bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        disabled={isLoading}
        onClick={onAutoConfigOpen}
        type="button"
      >
        Configure
      </button>

      {isAutoConfigOpen ? (
        <DiceAutoConfigModal
          config={autoConfig}
          onApply={onAutoConfigApply}
          onChange={onAutoConfigChange}
          onClose={onAutoConfigClose}
          onResetAll={onAutoConfigResetAll}
        />
      ) : null}
    </div>
  );
}

function formatAutoModeValue(
  mode: DiceAutoConfig["onWinMode"],
  increaseValue: string,
) {
  return mode === "reset" ? "Auto" : `${increaseValue}%`;
}
