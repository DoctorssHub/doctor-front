import type { Risk } from "@/entities/game/model/types";

type RiskSelectorProps = {
  isDisabled?: boolean;
  onRiskChange: (risk: Risk) => void;
  risk: Risk;
};

const riskLabels: Record<Risk, string> = {
  HIGH: "High",
  LOW: "Low",
  MEDIUM: "Medium",
};

const riskTone: Record<Risk, string> = {
  HIGH: "text-[#ef4444]",
  LOW: "text-[#22c55e]",
  MEDIUM: "text-[#facc15]",
};

export function RiskSelector({
  isDisabled = false,
  onRiskChange,
  risk,
}: RiskSelectorProps) {
  return (
    <fieldset className="mt-6 max-[1023px]:order-4 max-[1023px]:mt-5">
      <legend className="mb-3 text-sm font-semibold text-white">Risk</legend>
      <div className="grid grid-cols-3 gap-3">
        {(["LOW", "MEDIUM", "HIGH"] as const).map((nextRisk) => (
          <button
            className={`h-10 rounded-md text-sm font-semibold transition ${
              risk === nextRisk
                ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)]"
                : "hover:bg-[#171d29]"
            } ${riskTone[nextRisk]} disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isDisabled}
            key={nextRisk}
            onClick={() => onRiskChange(nextRisk)}
            type="button"
          >
            {riskLabels[nextRisk]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
