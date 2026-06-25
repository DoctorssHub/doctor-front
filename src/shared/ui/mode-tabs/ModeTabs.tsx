"use client";

import { memo, type ReactNode } from "react";

type ModeTabOption<TMode extends string> = {
  label: string;
  value: TMode;
};

type ModeTabsProps<TMode extends string> = {
  activeButtonClassName?: string;
  buttonClassName?: string;
  className?: string;
  inactiveButtonClassName?: string;
  isDisabled?: boolean;
  mode: TMode;
  options: Array<ModeTabOption<TMode>>;
  onModeChange: (mode: TMode) => void;
  renderIcon?: (mode: TMode, isActive: boolean) => ReactNode;
};

function ModeTabsComponent<TMode extends string>({
  activeButtonClassName = "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-white",
  buttonClassName = "flex h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
  className = "grid grid-cols-2 gap-3 rounded-lg max-[1023px]:order-7 max-[1023px]:mt-6",
  inactiveButtonClassName = "text-white/70 hover:bg-[#171d29]",
  isDisabled = false,
  mode,
  options,
  onModeChange,
  renderIcon,
}: ModeTabsProps<TMode>) {
  return (
    <div className={className}>
      {options.map((option) => {
        const isActive = mode === option.value;

        return (
          <button
            aria-pressed={isActive}
            className={[
              buttonClassName,
              isActive ? activeButtonClassName : inactiveButtonClassName,
            ].join(" ")}
            disabled={isDisabled}
            key={option.value}
            onClick={() => onModeChange(option.value)}
            type="button"
          >
            {renderIcon?.(option.value, isActive)}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const ModeTabs = memo(ModeTabsComponent) as typeof ModeTabsComponent;
export type { ModeTabOption, ModeTabsProps };
