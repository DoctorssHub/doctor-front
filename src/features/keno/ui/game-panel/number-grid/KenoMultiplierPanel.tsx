import { memo } from "react";
import Image from "next/image";
import kenoDiamondIcon from "@/assets/games/keno/diamond.svg";

type KenoMultiplierPanelProps = {
  multipliers: number[];
  selectedNumbersCount: number;
};

export const KenoMultiplierPanel = memo(function KenoMultiplierPanel({
  multipliers,
  selectedNumbersCount,
}: KenoMultiplierPanelProps) {
  if (selectedNumbersCount === 0) {
    return (
      <div className="mt-8 grid h-[67px] w-full max-w-[578px] place-items-center rounded-xl bg-[#202731] text-sm font-medium text-white/75 max-[767px]:mt-5 max-[767px]:h-11 max-[767px]:max-w-[325px] max-[767px]:text-[10px]">
        Select numbers 1-10 to start
      </div>
    );
  }

  return (
    <div
      className="mt-8 grid h-[50px] w-full max-w-[578px] gap-1 max-[767px]:mt-5 max-[767px]:h-11 max-[767px]:max-w-[325px] max-[767px]:gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${multipliers.length}, minmax(0, 1fr))`,
      }}
    >
      {multipliers.map((multiplier, hitCount) => (
        <div
          className="overflow-hidden rounded-[7px] border border-[#2e3a46] bg-[#242b36] text-center shadow-[0_8px_18px_rgb(0_0_0/18%)]"
          key={`${hitCount}-${multiplier}`}
        >
          <div className="flex h-[25px] items-center justify-center gap-1 max-[767px]:h-[22px] max-[767px]:gap-0.5 bg-[linear-gradient(rgb(10,39,26)_0%,rgb(57,177,125)_100%)] text-[11px] font-semibold text-white max-[767px]:text-[8px] shadow-[inset_0_-1px_0_rgb(255_255_255/12%)]">
            <Image
              alt=""
              aria-hidden="true"
              className="drop-shadow-[0_0_8px_rgb(109_243_155/70%)] max-[767px]:size-3"
              height={16}
              src={kenoDiamondIcon}
              width={16}
            />
            <span>{hitCount}x</span>
          </div>
          <div className="grid h-[25px] place-items-center text-[9px] max-[767px]:h-[22px] max-[767px]:text-[8px] font-semibold text-white">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      ))}
    </div>
  );
});
