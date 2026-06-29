import type { GameMode } from "@/entities/game/model/types";
import { ModeTabs as SharedModeTabs } from "@/shared/ui/mode-tabs";
import type { ModeTabOption, ModeTabsProps } from "@/shared/ui/mode-tabs";

const defaultModeOptions: Array<ModeTabOption<GameMode>> = [
  { label: "Manual", value: "Manual" },
  { label: "Auto", value: "Auto" },
];

type GameModeTabsProps<TMode extends string = GameMode> = Omit<
  ModeTabsProps<TMode>,
  "options"
> & {
  options?: Array<ModeTabOption<TMode>>;
};

export function ModeTabs<TMode extends string = GameMode>({
  activeButtonClassName = "bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]",
  buttonClassName = "h-10 rounded-lg transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
  className = "grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold max-[1023px]:order-7 max-[1023px]:mt-6",
  inactiveButtonClassName = "text-[var(--color-text-muted)] opacity-70 hover:text-white",
  options = defaultModeOptions as Array<ModeTabOption<TMode>>,
  ...props
}: GameModeTabsProps<TMode>) {
  return (
    <SharedModeTabs
      activeButtonClassName={activeButtonClassName}
      buttonClassName={buttonClassName}
      className={className}
      inactiveButtonClassName={inactiveButtonClassName}
      options={options}
      {...props}
    />
  );
}
