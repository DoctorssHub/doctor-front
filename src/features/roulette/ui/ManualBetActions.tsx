type ManualBetActionsProps = {
  canUndo: boolean;
  disabled: boolean;
  isVisible: boolean;
  onClear: () => void;
  onUndo: () => void;
};

export function ManualBetActions({
  canUndo,
  disabled,
  isVisible,
  onClear,
  onUndo,
}: ManualBetActionsProps) {
  return (
    <div
      className={[
        "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
        isVisible
          ? "max-h-[120px] translate-y-0 opacity-100"
          : "max-h-0 -translate-y-2 opacity-0",
      ].join(" ")}
    >
      <p className="text-sm font-medium">Choose action</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
        <button
          className="h-11 rounded-lg bg-[var(--color-surface-hover)] text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={onUndo}
          type="button"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
