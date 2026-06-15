import { memo } from "react";
import type { Risk } from "@/entities/game/model/types";

type RiskOption<TValue extends string> = {
  label: string;
  toneClassName?: string;
  value: TValue;
};

type RiskSelectorProps<TValue extends string> = {
  isDisabled?: boolean;
  label?: string;
  onRiskChange: (risk: TValue) => void;
  options?: Array<RiskOption<TValue>>;
  risk: TValue;
};

const defaultRiskOptions: Array<RiskOption<Risk>> = [
  { label: "Low", toneClassName: "text-[#22c55e]", value: "LOW" },
  { label: "Medium", toneClassName: "text-[#facc15]", value: "MEDIUM" },
  { label: "High", toneClassName: "text-[#ef4444]", value: "HIGH" },
];

function RiskSelectorComponent<TValue extends string = Risk>({
  isDisabled = false,
  label = "Risk",
  onRiskChange,
  options = defaultRiskOptions as Array<RiskOption<TValue>>,
  risk,
}: RiskSelectorProps<TValue>) {
  return (
    <fieldset className="mt-6 max-[1023px]:order-4 max-[1023px]:mt-5">
      <legend className="mb-3 text-sm font-semibold text-white">{label}</legend>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            className={`h-10 rounded-md text-sm font-semibold transition ${
              risk === option.value
                ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)]"
                : "hover:bg-[#171d29]"
            } ${option.toneClassName ?? "text-white"} disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isDisabled}
            key={option.value}
            onClick={() => onRiskChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export const RiskSelector = memo(
  RiskSelectorComponent,
) as typeof RiskSelectorComponent;
