import { memo } from "react";
import { getMultiplierTone } from "@/features/plinko/lib/board/multiplier";

type RecentMultipliersProps = {
  multipliers: number[];
};

export const RecentMultipliers = memo(function RecentMultipliers({
  multipliers,
}: RecentMultipliersProps) {
  return (
    <div className="absolute top-4 right-3 flex flex-col gap-1.5 tablet:top-6 tablet:right-6 tablet:gap-3">
      {multipliers.slice(0, 3).map((multiplier, index) => (
        <div
          className={`flex h-5 min-w-8 items-center justify-center rounded px-1.5 text-[10px] font-bold tablet:h-6 tablet:min-w-10 tablet:rounded-md tablet:px-2 tablet:text-[11px] ${getMultiplierTone(multiplier, false)}`}
          key={`${multiplier}-${index}`}
        >
          {multiplier}x
        </div>
      ))}
    </div>
  );
});
