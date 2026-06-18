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
    <section className="relative flex min-w-0 flex-col justify-between overflow-hidden border-b-2 border-r-2 border-[var(--color-surface)] bg-[linear-gradient(180deg,#10151F_0%,#10151F_55%,#0D2428_100%)] px-7 pb-20 pt-8 max-[1023px]:order-1 max-[1023px]:min-h-[500px] max-[1023px]:border-0 max-[1023px]:px-5 max-[767px]:min-h-[540px] max-[767px]:px-4 laptop:h-[668px] laptop:w-full laptop:rounded-[0_16px_16px_0]">
      <DiceHistory results={resultHistory} />

      <div className="flex flex-1 items-center">
        <DiceRange
          above={above}
          isLoading={isLoading}
          result={result}
          threshold={threshold}
          onThresholdChange={onThresholdChange}
        />
      </div>

      <div className="mx-auto grid w-full max-w-[555px] grid-cols-3 gap-8 rounded-lg bg-[#151C26]/75 p-3 max-[767px]:grid-cols-1 max-[767px]:gap-3">
        <DiceNumberField
          id="dice-multiplier"
          label="Multiplier"
          min={1.01}
          value={formatDiceNumber(multiplier)}
          onChange={onMultiplierChange}
        />
        <label className="block min-w-0" htmlFor="dice-rollover">
          <span className="mb-2 block text-sm font-semibold text-white">
            Rollover
          </span>
          <span className="flex h-10 overflow-hidden rounded-md bg-[#252B36]/80">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white/75 outline-none"
              id="dice-rollover"
              inputMode="decimal"
              max={99.99}
              min={0.01}
              onChange={(event) => onThresholdChange(Number(event.target.value))}
              step={0.01}
              type="number"
              value={formatDiceNumber(threshold)}
            />
            <button
              aria-label={above ? "Switch to roll under" : "Switch to roll over"}
              className="grid w-12 place-items-center text-lg font-semibold text-white/80 transition hover:bg-white/5"
              onClick={() => onAboveChange(!above)}
              type="button"
            >
              {above ? ">" : "<"}
            </button>
          </span>
        </label>
        <DiceNumberField
          id="dice-chance"
          label="Chance"
          max={99.99}
          min={0.01}
          suffix="%"
          value={chance.toFixed(4)}
          onChange={onChanceChange}
        />
      </div>
    </section>
  );
}
