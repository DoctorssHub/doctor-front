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
  options = defaultModeOptions as Array<ModeTabOption<TMode>>,
  ...props
}: GameModeTabsProps<TMode>) {
  return <SharedModeTabs options={options} {...props} />;
}
