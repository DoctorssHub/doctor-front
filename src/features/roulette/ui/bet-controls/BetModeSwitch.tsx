type BetModeSwitchProps = {
  disabled: boolean;
  mode: "manual" | "auto";
  onModeChange: (mode: "manual" | "auto") => void;
};

function getModeButtonClass(isActive: boolean) {
  const baseClass = "h-10 rounded-lg transition duration-300";
  const stateClass = isActive
    ? "bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
    : "text-[var(--color-text-muted)] opacity-70 hover:text-white";

  return `${baseClass} ${stateClass}`;
}

export function BetModeSwitch({
  disabled,
  mode,
  onModeChange,
}: BetModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold">
      <button
        className={getModeButtonClass(mode === "manual")}
        disabled={disabled}
        onClick={() => onModeChange("manual")}
        type="button"
      >
        Manual
      </button>
      <button
        className={getModeButtonClass(mode === "auto")}
        disabled={disabled}
        onClick={() => onModeChange("auto")}
        type="button"
      >
        Auto
      </button>
    </div>
  );
}
