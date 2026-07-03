import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { BetAmountField } from "@/shared/ui/game-sidebar/ui/BetAmountField";
import { GameBetButton } from "@/shared/ui/game-sidebar/ui/GameBetButton";
import { GameSidebar } from "@/shared/ui/game-sidebar/ui/GameSidebar";
import { ModeTabs } from "@/shared/ui/game-sidebar/ui/ModeTabs";
import type { DiceAutoConfig, DiceMode } from "../../model/dice-game-options";
import { DiceAutoPanel } from "./DiceAutoPanel";
import { DiceManualPanel } from "./DiceManualPanel";
import { useDiceBetControlsForm } from "./useDiceBetControlsForm";

type DiceBetControlsProps = {
  autoConfig: DiceAutoConfig;
  gameBalance: number;
  helperMessage: string | null;
  isAutoConfigOpen: boolean;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isAutoStopRequested: boolean;
  isBetDisabled: boolean;
  isFullscreen?: boolean;
  isLoading: boolean;
  maxBet: string;
  minBet: string;
  multiplier: number;
  onAutoBetCountChange: (amount: string) => void;
  onAutoConfigApply: () => void;
  onAutoConfigChange: (config: DiceAutoConfig) => void;
  onAutoConfigClose: () => void;
  onAutoConfigOpen: () => void;
  onAutoConfigResetAll: () => void;
  onBetAmountChange: (amount: string) => void;
  onModeChange: (mode: DiceMode) => void;
  onSubmit: () => void;
  onToggleAutoInfinite: () => void;
};

export function DiceBetControls({
  autoConfig,
  gameBalance,
  helperMessage,
  isAutoConfigOpen,
  isAutoInfinite,
  isAutoRunning,
  isAutoStopRequested,
  isBetDisabled,
  isFullscreen = false,
  isLoading,
  maxBet,
  minBet,
  multiplier,
  onAutoBetCountChange,
  onAutoConfigApply,
  onAutoConfigChange,
  onAutoConfigClose,
  onAutoConfigOpen,
  onAutoConfigResetAll,
  onBetAmountChange,
  onModeChange,
  onSubmit,
  onToggleAutoInfinite,
}: DiceBetControlsProps) {
  const showMaxControl = useGameSettingsStore(
    (state) => state.isMaxBetControlEnabled,
  );
  const form = useDiceBetControlsForm({
    gameBalance,
    helperMessage,
    isAutoInfinite,
    isAutoRunning,
    isAutoStopRequested,
    maxBet,
    minBet,
    multiplier,
    onAutoBetCountChange,
    onBetAmountChange,
    onModeChange,
  });

  return (
    <GameSidebar
      className={isFullscreen ? "min-[1024px]:h-full" : undefined}
    >
      <ModeTabs
        className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold"
        isDisabled={isLoading}
        mode={form.mode}
        options={[
          { label: "Manual", value: "manual" },
          { label: "Auto", value: "auto" },
        ]}
        onModeChange={form.handleModeChange}
      />

      <BetAmountField
        betAmount={form.betAmount}
        gameBalance={gameBalance}
        isDisabled={isLoading}
        maxBet={maxBet}
        minBet={minBet}
        showMaxControl={showMaxControl}
        onBetAmountBlur={form.handleBetAmountBlur}
        onBetAmountChange={form.handleBetAmountChange}
        onBetAmountControlClick={form.handleBetAmountControlClick}
      />

      {form.mode === "auto" ? (
        <DiceAutoPanel
          autoBetCount={form.autoBetCount}
          autoConfig={autoConfig}
          isAutoConfigOpen={isAutoConfigOpen}
          isAutoInfinite={isAutoInfinite}
          isLoading={isLoading}
          onAutoBetCountChange={form.handleAutoBetCountChange}
          onAutoConfigApply={onAutoConfigApply}
          onAutoConfigChange={onAutoConfigChange}
          onAutoConfigClose={onAutoConfigClose}
          onAutoConfigOpen={onAutoConfigOpen}
          onAutoConfigResetAll={onAutoConfigResetAll}
          onToggleAutoInfinite={onToggleAutoInfinite}
        />
      ) : (
        <DiceManualPanel profitOnWin={form.profitOnWin} />
      )}

      <GameBetButton
        className={form.mode === "auto" ? "mt-2" : "mt-6"}
        disabled={
          isBetDisabled ||
          form.isBetAmountInvalid ||
          form.isAutoBetCountInvalid
        }
        isLoading={isLoading}
        label={form.actionLabel}
        onClick={onSubmit}
      />

      {form.submitHelperMessage ? (
        <p className="mt-3 min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {form.submitHelperMessage}
        </p>
      ) : (
        <p className="mt-3 min-h-5" />
      )}
    </GameSidebar>
  );
}
