import type { DiceAutoConfig } from "../../model/dice-game-options";

type AutoModeControlProps = {
  increaseValue: string;
  label: string;
  mode: DiceAutoConfig["onWinMode"];
  onIncreaseChange: (value: string) => void;
  onModeChange: (mode: DiceAutoConfig["onWinMode"]) => void;
};

export function AutoModeControl({
  increaseValue,
  label,
  mode,
  onIncreaseChange,
  onModeChange,
}: AutoModeControlProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-white">{label}</p>
      <div className="flex h-11 w-[470px] items-center rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 text-xs font-semibold leading-[1.33] text-[#c7cbd4] max-[620px]:w-full">
        <button
          className={`h-7 rounded-[4px] border border-[#1b1f26] px-3 py-1.5 text-[10px] font-semibold leading-none transition ${
            mode === "reset"
              ? "bg-[#c82831] text-[#fff7f7] hover:bg-[#d93a43]"
              : "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-[#c7cbd4] hover:text-white"
          }`}
          onClick={() => onModeChange("reset")}
          type="button"
        >
          Reset
        </button>
        <button
          className={`ml-1 h-7 rounded-[4px] border border-[#1b1f26] px-3 py-1.5 text-[10px] font-semibold leading-none transition ${
            mode === "increase"
              ? "bg-[#c82831] text-[#fff7f7] hover:bg-[#d93a43]"
              : "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-[#c7cbd4] hover:text-white"
          }`}
          onClick={() => onModeChange("increase")}
          type="button"
        >
          Increase By
        </button>
        <input
          aria-label={`${label} increase percent`}
          className="ml-auto w-16 bg-transparent text-right text-xs font-semibold leading-[1.33] text-[#c7cbd4] outline-none"
          inputMode="decimal"
          onChange={(event) => onIncreaseChange(event.target.value)}
          pattern="[0-9]*[.]?[0-9]*"
          type="text"
          value={increaseValue}
        />
        <span className="ml-2 text-xs font-semibold leading-[1.33] text-[#c7cbd4]">
          %
        </span>
      </div>
    </div>
  );
}
