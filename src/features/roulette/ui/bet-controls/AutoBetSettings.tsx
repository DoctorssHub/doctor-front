import Image from "next/image";
import infinityIcon from "@/assets/games/roulette/Infinity.svg";

type AutoBetSettingsProps = {
  autoBetCount: string;
  disabled: boolean;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isVisible: boolean;
  onAutoBetCountChange: (value: string) => void;
  onToggleAutoInfinite: () => void;
};

export function AutoBetSettings({
  autoBetCount,
  disabled,
  isAutoInfinite,
  isAutoRunning,
  isVisible,
  onAutoBetCountChange,
  onToggleAutoInfinite,
}: AutoBetSettingsProps) {
  return (
    <div
      className={[
        "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
        isVisible
          ? "max-h-[100px] translate-y-0 opacity-100"
          : "max-h-0 -translate-y-2 opacity-0",
      ].join(" ")}
    >
      <label className="text-sm font-medium" htmlFor="roulette-auto-bet-count">
        Number of bets
      </label>
      <div className="mt-3 flex h-11 items-center gap-2 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-roulette-auto-field)] p-3">
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
            "grid h-7 w-7 shrink-0 place-items-center rounded-[4px] border border-[var(--color-border-button)] transition hover:border-[var(--color-roulette-soft-border)] disabled:opacity-55",
            isAutoInfinite ? "bg-[var(--color-surface-icon)]" : "bg-transparent",
          ].join(" ")}
          disabled={disabled}
          onClick={onToggleAutoInfinite}
          type="button"
        >
          <Image alt="" className="h-4 w-4 object-contain" src={infinityIcon} />
        </button>
      </div>
    </div>
  );
}
