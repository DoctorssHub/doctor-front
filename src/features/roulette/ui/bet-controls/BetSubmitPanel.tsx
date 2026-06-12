type BetSubmitPanelProps = {
  actionLabel: string;
  helperMessage: string | null;
  isAutoRunning: boolean;
  isBetDisabled: boolean;
  isLoading: boolean;
  onSubmit: () => void;
};

export function BetSubmitPanel({
  actionLabel,
  helperMessage,
  isAutoRunning,
  isBetDisabled,
  isLoading,
  onSubmit,
}: BetSubmitPanelProps) {
  return (
    <div className="space-y-3">
      <button
        className={[
          "h-12 w-full rounded-lg text-sm font-bold transition disabled:bg-[var(--color-surface-hover)] disabled:text-[var(--color-text-disabled)]",
          isAutoRunning
            ? "bg-[var(--color-roulette-stop)] text-[var(--color-brand-contrast)] hover:bg-[var(--color-roulette-stop-hover)]"
            : "bg-[var(--color-brand)] text-[var(--color-brand-contrast)] hover:bg-[var(--color-brand-hover)]",
        ].join(" ")}
        disabled={isBetDisabled}
        onClick={onSubmit}
        type="button"
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            />
          ) : null}
          {actionLabel}
        </span>
      </button>
      {helperMessage ? (
        <p className="min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {helperMessage}
        </p>
      ) : (
        <p className="min-h-5" />
      )}
    </div>
  );
}
