import { ROULETTE_CHIP_VALUES } from "../model/roulette-constants";

type BetControlsProps = {
  selectedChip: number;
  totalBetAmount: number;
  gameBalance: number;
  minBet: number;
  maxBet: number;
  isSpinning: boolean;
  canUndo: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSelectChip: (chip: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onSubmit: () => void;
};

function formatChipLabel(value: number) {
  return value >= 1000 ? `${value / 1000}K` : String(value);
}

function formatCoinAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function BetControls({
  selectedChip,
  totalBetAmount,
  gameBalance,
  minBet,
  maxBet,
  isSpinning,
  canUndo,
  isSubmitting,
  errorMessage,
  onSelectChip,
  onClear,
  onUndo,
  onSubmit,
}: BetControlsProps) {
  const isBetInvalid =
    totalBetAmount < minBet ||
    totalBetAmount > maxBet ||
    totalBetAmount > gameBalance;
  const isBetDisabled = isSpinning || isSubmitting || isBetInvalid;
  const helperMessage =
    totalBetAmount > gameBalance
      ? "Not enough coins"
      : totalBetAmount > 0 && totalBetAmount < minBet
        ? `Minimum bet is ${formatCoinAmount(minBet)}`
        : totalBetAmount > maxBet
          ? `Maximum bet is ${formatCoinAmount(maxBet)}`
          : errorMessage;

  return (
    <aside className="flex flex-col gap-7 bg-[var(--color-surface)] p-5 text-[var(--color-text-primary)] md:p-6">
      <div className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold">
        <button
          className="h-10 rounded-lg bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
          type="button"
        >
          Manual
        </button>
        <button
          className="h-10 rounded-lg text-[var(--color-text-muted)] opacity-70"
          disabled
          type="button"
        >
          Auto
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Chip Value</span>
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-3.5 w-3.5 rounded-full bg-[var(--color-text-subtle)]" />
            {formatCoinAmount(gameBalance)} COINS
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Bet Amount</span>
          <span className="flex items-center gap-2 font-semibold">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--color-brand)] text-[10px] text-[var(--color-brand-contrast)]">
              $
            </span>
            {formatCoinAmount(totalBetAmount)} COINS
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-2">
          {ROULETTE_CHIP_VALUES.map((chip) => {
            const isSelected = chip === selectedChip;

            return (
              <button
                className={[
                  "relative grid aspect-square min-h-10 place-items-center rounded-full border-4 border-dashed text-xs font-bold transition",
                  isSelected
                    ? "border-[var(--color-brand)] bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-brand-glow)]"
                    : "border-[var(--color-border-button)] bg-[var(--color-surface-chip)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]",
                ].join(" ")}
                disabled={isSpinning || isSubmitting}
                key={chip}
                onClick={() => onSelectChip(chip)}
                type="button"
              >
                <span className="grid h-[72%] w-[72%] place-items-center rounded-full border border-white/20">
                  {formatChipLabel(chip)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Choose action</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
            disabled={!canUndo || isSpinning || isSubmitting}
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
          <button
            className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
            disabled={!canUndo || isSpinning || isSubmitting}
            onClick={onUndo}
            type="button"
          >
            Undo
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="h-12 w-full rounded-lg bg-[var(--color-brand)] text-sm font-bold text-[var(--color-brand-contrast)] transition hover:bg-[var(--color-brand-hover)] disabled:bg-[var(--color-surface-hover)] disabled:text-[var(--color-text-disabled)]"
          disabled={isBetDisabled}
          onClick={onSubmit}
          type="button"
        >
          {isSubmitting ? "Betting..." : "Bet"}
        </button>
        {helperMessage ? (
          <p className="min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
            {helperMessage}
          </p>
        ) : (
          <p className="min-h-5" />
        )}
      </div>
    </aside>
  );
}
