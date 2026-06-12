import { AutoBetSettings } from "./AutoBetSettings";
import { BetModeSwitch } from "./BetModeSwitch";
import { BetSubmitPanel } from "./BetSubmitPanel";
import { ChipPicker } from "./ChipPicker";
import { ManualBetActions } from "./ManualBetActions";
import { formatCoinAmount } from "../../lib/roulette-formatters";

type BetControlsProps = {
  mode: "manual" | "auto";
  selectedChip: number;
  totalBetAmount: number;
  gameBalance: number;
  minBet: number;
  maxBet: number;
  isSpinning: boolean;
  isAutoRunning: boolean;
  canUndo: boolean;
  isSubmitting: boolean;
  isAnimating: boolean;
  autoBetCount: string;
  isAutoInfinite: boolean;
  errorMessage: string | null;
  onModeChange: (mode: "manual" | "auto") => void;
  onSelectChip: (chip: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onSubmit: () => void;
  onAutoBetCountChange: (value: string) => void;
  onToggleAutoInfinite: () => void;
};

export function BetControls({
  mode,
  selectedChip,
  totalBetAmount,
  gameBalance,
  minBet,
  maxBet,
  isSpinning,
  isAutoRunning,
  canUndo,
  isSubmitting,
  isAnimating,
  autoBetCount,
  isAutoInfinite,
  errorMessage,
  onModeChange,
  onSelectChip,
  onClear,
  onUndo,
  onSubmit,
  onAutoBetCountChange,
  onToggleAutoInfinite,
}: BetControlsProps) {
  const isLoading = isSpinning || isSubmitting || isAnimating;
  const controlsDisabled = isAutoRunning || isLoading;
  const isBetInvalid =
    totalBetAmount < minBet ||
    totalBetAmount > maxBet ||
    totalBetAmount > gameBalance;
  const normalizedAutoBetCount = Number(autoBetCount);
  const isAutoBetCountInvalid =
    mode === "auto" &&
    !isAutoInfinite &&
    (!Number.isInteger(normalizedAutoBetCount) || normalizedAutoBetCount < 1);
  const isBetDisabled =
    isLoading ||
    (!isAutoRunning && (isBetInvalid || isAutoBetCountInvalid));
  const helperMessage =
    totalBetAmount > gameBalance
      ? "Not enough coins"
      : totalBetAmount > 0 && totalBetAmount < minBet
        ? `Minimum bet is ${formatCoinAmount(minBet)}`
        : totalBetAmount > maxBet
          ? `Maximum bet is ${formatCoinAmount(maxBet)}`
          : isAutoBetCountInvalid
            ? "Enter at least 1 bet"
            : errorMessage;
  const actionLabel = isLoading
    ? "Betting..."
    : isAutoRunning
      ? "Stop Auto"
      : "Bet";

  return (
    <aside className="flex flex-col gap-6 bg-[var(--color-surface)] p-5 text-[var(--color-text-primary)] md:p-6 lg:h-[668px] lg:w-[352px] lg:rounded-[16px_0_0_16px]">
      <BetModeSwitch
        disabled={controlsDisabled}
        mode={mode}
        onModeChange={onModeChange}
      />
      <ChipPicker
        disabled={controlsDisabled}
        selectedChip={selectedChip}
        totalBetAmount={totalBetAmount}
        onSelectChip={onSelectChip}
      />

      <div>
        <ManualBetActions
          canUndo={canUndo}
          disabled={controlsDisabled}
          isVisible={mode === "manual"}
          onClear={onClear}
          onUndo={onUndo}
        />
        <AutoBetSettings
          autoBetCount={autoBetCount}
          disabled={isAutoRunning}
          isAutoInfinite={isAutoInfinite}
          isAutoRunning={isAutoRunning}
          isVisible={mode === "auto"}
          onAutoBetCountChange={onAutoBetCountChange}
          onToggleAutoInfinite={onToggleAutoInfinite}
        />
      </div>

      <BetSubmitPanel
        actionLabel={actionLabel}
        helperMessage={helperMessage}
        isAutoRunning={isAutoRunning}
        isBetDisabled={isBetDisabled}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </aside>
  );
}
