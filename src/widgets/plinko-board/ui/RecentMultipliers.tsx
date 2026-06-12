import { getMultiplierTone } from "@/widgets/plinko-board/lib/multiplier";

type RecentMultipliersProps = {
  multipliers: number[];
};

export function RecentMultipliers({ multipliers }: RecentMultipliersProps) {
  return (
    <div className="absolute top-6 right-6 hidden flex-col gap-3 md:flex">
      {multipliers.slice(0, 3).map((multiplier, index) => (
        <div
          className={`flex h-6 min-w-10 items-center justify-center rounded-md px-2 text-[11px] font-bold ${getMultiplierTone(multiplier, false)}`}
          key={`${multiplier}-${index}`}
        >
          {multiplier}x
        </div>
      ))}
    </div>
  );
}
