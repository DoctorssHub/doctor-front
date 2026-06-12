type BetModeSwitchProps = {
  disabled: boolean;
  mode: "manual" | "auto";
  onModeChange: (mode: "manual" | "auto") => void;
};

export function BetModeSwitch({
  disabled,
  mode,
  onModeChange,
}: BetModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold">
      <button
        className={[
          "h-10 rounded-lg transition duration-300",
          mode === "manual"
            ? "bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
            : "text-[var(--color-text-muted)] opacity-70 hover:text-white",
        ].join(" ")}
        disabled={disabled}
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
        disabled={disabled}
        onClick={() => onModeChange("auto")}
        type="button"
      >
        Auto
      </button>
    </div>
  );
}
