import type { FairnessVerifyResult } from "../../model/verify-types";

type VerifyResultProps = {
  result: FairnessVerifyResult | null;
};

export function VerifyResult({ result }: VerifyResultProps) {
  if (!result) {
    return null;
  }

  let label = "";

  switch (result.game) {
    case "roulette":
      label = `Roulette number: ${result.number}`;
      break;
    case "dice":
      label = `Dice roll: ${result.roll.toFixed(2)}`;
      break;
    case "keno":
      label = `Keno tiles: ${result.tiles.map((tile) => tile + 1).join(", ")}`;
      break;
    case "plinko":
      label = `Plinko ${result.risk.toLowerCase()} ${result.rows} rows: ${result.multiplier}x`;
      break;
  }

  return (
    <div className="rounded-lg border border-[var(--color-brand)]/40 bg-[var(--color-claim-panel)] p-3 text-sm font-bold text-[var(--color-brand)]">
      {label}
    </div>
  );
}
