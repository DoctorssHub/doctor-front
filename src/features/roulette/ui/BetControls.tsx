import Image, { type StaticImageData } from "next/image";
import infinityIcon from "@/assets/games/roulette/Infinity.svg";
import chip1 from "@/assets/games/roulette/Coint_1.webp";
import chip5 from "@/assets/games/roulette/Coint_2.webp";
import chip25 from "@/assets/games/roulette/Coint_3.webp";
import chip50 from "@/assets/games/roulette/Coint_4.webp";
import chip250 from "@/assets/games/roulette/Coint_5.webp";
import chip25k from "@/assets/games/roulette/Coint_6.webp";
import chip500 from "@/assets/games/roulette/Coint_7.webp";
import chip2k from "@/assets/games/roulette/Coint_8.webp";
import chip5k from "@/assets/games/roulette/Coint_9.webp";
import chip50k from "@/assets/games/roulette/Coint_10.webp";
import { ROULETTE_CHIP_VALUES } from "../model/roulette-constants";

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

const CHIP_IMAGES = new Map<number, StaticImageData>([
  [1, chip1],
  [5, chip5],
  [25, chip25],
  [50, chip50],
  [250, chip250],
  [500, chip500],
  [2000, chip2k],
  [5000, chip5k],
  [25000, chip25k],
  [50000, chip50k],
]);

function formatChipLabel(value: number) {
  return value >= 1000 ? `${value / 1000}K` : String(value);
}

function formatCoinAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

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
  const selectedChipImage = CHIP_IMAGES.get(selectedChip);
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
    !isAutoRunning &&
    (isSpinning || isSubmitting || isBetInvalid || isAutoBetCountInvalid);
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
  const actionLabel = isAutoRunning
    ? "Stop Auto"
    : isSubmitting
      ? "Betting..."
      : "Bet";

  return (
    <aside className="flex flex-col gap-6 bg-[#0e121c] p-5 text-[var(--color-text-primary)] md:p-6 lg:h-[668px] lg:w-[352px] lg:rounded-[16px_0_0_16px]">
      <div className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold">
        <button
          className={[
            "h-10 rounded-lg transition duration-300",
            mode === "manual"
              ? "bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
              : "text-[var(--color-text-muted)] opacity-70 hover:text-white",
          ].join(" ")}
          disabled={isAutoRunning || isSpinning || isSubmitting}
          onClick={() => onModeChange("manual")}
          type="button"
        >
          Manual
        </button>
        <button
          className={[
            "h-10 rounded-lg transition duration-300",
            mode === "auto"
              ? "bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
              : "text-[var(--color-text-muted)] opacity-70 hover:text-white",
          ].join(" ")}
          disabled={isAutoRunning || isSpinning || isSubmitting}
          onClick={() => onModeChange("auto")}
          type="button"
        >
          Auto
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Chip Value</span>
          <span className="flex items-center gap-2 font-semibold">
            {selectedChipImage ? (
              <Image
                alt=""
                className="h-5 w-5 object-contain"
                src={selectedChipImage}
              />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full bg-[var(--color-text-subtle)]" />
            )}
            {formatCoinAmount(selectedChip)} COINS
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
            const chipImage = CHIP_IMAGES.get(chip);

            return (
              <button
                className={[
                  "relative grid aspect-square min-h-10 place-items-center rounded-full text-xs font-bold transition",
                  isSelected
                    ? "scale-105 text-white drop-shadow-[0_0_14px_rgb(34_197_94_/_34%)]"
                    : "text-[var(--color-text-muted)] hover:scale-105",
                ].join(" ")}
                disabled={isAutoRunning || isSpinning || isSubmitting}
                key={chip}
                onClick={() => onSelectChip(chip)}
                type="button"
              >
                {chipImage ? (
                  <Image
                    alt={`${formatChipLabel(chip)} coin`}
                    className="h-full w-full object-contain"
                    priority={chip <= 250}
                    src={chipImage}
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center rounded-full border-4 border-dashed border-[#a78bfa] bg-[var(--color-surface-chip)] text-sm text-white">
                    {formatChipLabel(chip)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div
          className={[
            "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
            mode === "manual"
              ? "max-h-[120px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0",
          ].join(" ")}
        >
          <p className="text-sm font-medium">Choose action</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
              disabled={
                !canUndo || isAutoRunning || isSpinning || isSubmitting
              }
              onClick={onClear}
              type="button"
            >
              Clear
            </button>
            <button
              className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
              disabled={
                !canUndo || isAutoRunning || isSpinning || isSubmitting
              }
              onClick={onUndo}
              type="button"
            >
              Undo
            </button>
          </div>
        </div>

        <div
          className={[
            "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
            mode === "auto"
              ? "max-h-[100px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0",
          ].join(" ")}
        >
          <label
            className="text-sm font-medium"
            htmlFor="roulette-auto-bet-count"
          >
            Number of bets
          </label>
          <div className="mt-3 flex h-11 items-center gap-2 rounded-lg border border-[#1b1f26] bg-[rgba(27,31,38,0.25)] p-3">
            <div className="relative min-w-0 flex-1">
              {isAutoInfinite ? (
                <Image
                  alt=""
                  className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 object-contain"
                  src={infinityIcon}
                />
              ) : null}
              <input
                className={[
                  "w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-[var(--color-text-muted)] disabled:opacity-55",
                  isAutoInfinite ? "opacity-0" : "opacity-100",
                ].join(" ")}
                disabled={isAutoInfinite || isAutoRunning}
                id="roulette-auto-bet-count"
                inputMode="numeric"
                onChange={(event) => onAutoBetCountChange(event.target.value)}
                pattern="[0-9]*"
                type="text"
                value={isAutoInfinite ? "" : autoBetCount}
              />
            </div>
            <button
              aria-label="Unlimited auto bets"
              className={[
                "grid h-7 w-7 shrink-0 place-items-center rounded-[4px] border border-[#2b303b] transition hover:border-white/50 disabled:opacity-55",
                isAutoInfinite ? "bg-[#1b1f26]" : "bg-transparent",
              ].join(" ")}
              disabled={isAutoRunning}
              onClick={onToggleAutoInfinite}
              type="button"
            >
              <Image
                alt=""
                className="h-4 w-4 object-contain"
                src={infinityIcon}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className={[
            "h-12 w-full rounded-lg text-sm font-bold transition disabled:bg-[var(--color-surface-hover)] disabled:text-[var(--color-text-disabled)]",
            isAutoRunning
              ? "bg-[#d71920] text-black hover:bg-[#e2272e]"
              : "bg-[var(--color-brand)] text-[var(--color-brand-contrast)] hover:bg-[var(--color-brand-hover)]",
          ].join(" ")}
          disabled={isBetDisabled}
          onClick={onSubmit}
          type="button"
        >
          {actionLabel}
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
