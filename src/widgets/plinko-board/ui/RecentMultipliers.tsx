import { getMultiplierTone } from "@/widgets/plinko-board/lib/multiplier";

type RecentMultipliersProps = {
  multipliers: number[];
};

export function RecentMultipliers({ multipliers }: RecentMultipliersProps) {
  return (
    <div className="absolute top-4 right-3 flex flex-col gap-1.5 md:top-6 md:right-6 md:gap-3">
      {multipliers.slice(0, 3).map((multiplier, index) => (
        <div
          className={`flex h-5 min-w-8 items-center justify-center rounded px-1.5 text-[10px] font-bold md:h-6 md:min-w-10 md:rounded-md md:px-2 md:text-[11px] ${getMultiplierTone(multiplier, false)}`}
          key={`${multiplier}-${index}`}
        >
          {multiplier}x
        </div>
      ))}
    </div>
  );
}
