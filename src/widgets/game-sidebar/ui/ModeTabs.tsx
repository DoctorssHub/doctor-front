import { memo } from "react";
import type { GameMode } from "@/entities/game/model/types";

type ModeTabOption<TMode extends string> = {
  label: string;
  value: TMode;
};

type ModeTabsProps<TMode extends string = GameMode> = {
  activeButtonClassName?: string;
  buttonClassName?: string;
  className?: string;
  inactiveButtonClassName?: string;
  isDisabled?: boolean;
  mode: TMode;
  options?: Array<ModeTabOption<TMode>>;
  onModeChange: (mode: TMode) => void;
};

const defaultModeOptions: Array<ModeTabOption<GameMode>> = [
  { label: "Manual", value: "Manual" },
  { label: "Auto", value: "Auto" },
];

function ModeTabsComponent<TMode extends string = GameMode>({
  activeButtonClassName = "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-white",
  buttonClassName = "flex h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
  className = "grid grid-cols-2 gap-3 rounded-lg max-[1023px]:order-7 max-[1023px]:mt-6",
  inactiveButtonClassName = "text-white/70 hover:bg-[#171d29]",
  isDisabled = false,
  mode,
  options = defaultModeOptions as Array<ModeTabOption<TMode>>,
  onModeChange,
}: ModeTabsProps<TMode>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <button
          className={[
            buttonClassName,
            mode === option.value
              ? activeButtonClassName
              : inactiveButtonClassName,
          ].join(" ")}
          disabled={isDisabled}
          key={option.value}
          onClick={() => onModeChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const ModeTabs = memo(ModeTabsComponent) as typeof ModeTabsComponent;
