import closeRangeIcon from "@/assets/games/dice/closeRangeIcon.svg";
import percentIcon from "@/assets/games/dice/percentIcon.svg";
import relloverIcon from "@/assets/games/dice/relloverIcon.svg";
import type { DiceBetResponse } from "../../api/dice-types";
import { formatDiceNumber } from "../../lib/dice-calculations";
import { DiceHistory } from "./DiceHistory";
import { DiceNumberField } from "./DiceNumberField";
import { DiceRange } from "./DiceRange";

type DiceGamePanelProps = {
  above: boolean;
  chance: number;
  isLoading: boolean;
  multiplier: number;
  result: DiceBetResponse | null;
  resultHistory: DiceBetResponse[];
  threshold: number;
  onAboveChange: (above: boolean) => void;
  onChanceChange: (chance: number) => void;
  onMultiplierChange: (multiplier: number) => void;
  onThresholdChange: (threshold: number) => void;
};

export function DiceGamePanel({
  above,
  chance,
  isLoading,
  multiplier,
  result,
  resultHistory,
  threshold,
  onAboveChange,
  onChanceChange,
  onMultiplierChange,
  onThresholdChange,
}: DiceGamePanelProps) {
  return (
    <section className="relative flex min-w-0 flex-col justify-between overflow-hidden border-b-2 border-r-2 border-[var(--color-surface)] bg-[linear-gradient(180deg,#10151F_0%,#10151F_55%,#3A170D_100%)] px-7 pb-20 pt-8 max-[1023px]:order-1 max-[1023px]:min-h-[500px] max-[1023px]:border-0 max-[1023px]:px-5 max-[767px]:min-h-[540px] max-[767px]:px-4 laptop:h-[668px] laptop:w-full laptop:rounded-[0_16px_16px_0]">
      <DiceHistory results={resultHistory} />

      <div className="flex flex-1 items-center">
        <DiceRange
          isLoading={isLoading}
          result={result}
          threshold={threshold}
          onThresholdChange={onThresholdChange}
        />
      </div>

      <div className="mx-auto grid h-28 w-[602px] max-w-full grid-cols-3 gap-[34px] rounded-lg bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] px-3 py-5 max-mobile:h-[110px] max-mobile:w-full max-mobile:gap-3 mobile:max-tablet:h-[110px] mobile:max-tablet:w-full mobile:max-tablet:gap-3">
        <DiceNumberField
          iconSrc={closeRangeIcon}
          id="dice-multiplier"
          isDisabled={isLoading}
          label="Multiplier"
          min={1.01}
          value={formatDiceNumber(multiplier)}
          onChange={onMultiplierChange}
        />
        <DiceNumberField
          iconAlt={above ? "Switch to roll under" : "Switch to roll over"}
          iconSrc={relloverIcon}
          id="dice-rollover"
          isDisabled={isLoading}
          label="Rollover"
          max={99.99}
          min={0.01}
          value={formatDiceNumber(threshold)}
          onChange={onThresholdChange}
          onIconClick={() => onAboveChange(!above)}
        />
        <DiceNumberField
          iconSrc={percentIcon}
          id="dice-chance"
          isDisabled={isLoading}
          label="Chance"
          max={99.99}
          min={0.01}
          value={chance.toFixed(4)}
          onChange={onChanceChange}
        />
      </div>
    </section>
  );
}
