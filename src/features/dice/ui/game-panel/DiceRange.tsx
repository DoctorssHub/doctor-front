import Image from "next/image";
import rangeLineIcon from "@/assets/games/dice/rangeLineIcon.svg";
import resultPolygonIcon from "@/assets/games/dice/resultPolygonIcon.svg";
import type { DiceBetResponse } from "../../api/dice-types";

type DiceRangeProps = {
  above: boolean;
  isLoading: boolean;
  result: DiceBetResponse | null;
  threshold: number;
  onThresholdChange: (threshold: number) => void;
};

const tickMarks = [2, 25, 50, 75, 100];

export function DiceRange({
  above,
  isLoading,
  result,
  threshold,
  onThresholdChange,
}: DiceRangeProps) {
  const markerPosition = `${threshold}%`;
  const visibleResult = result;
  const resultPosition = visibleResult
    ? `${visibleResult.randomValue}%`
    : null;
  const gradient = above
    ? `linear-gradient(90deg, #ef4444 0%, #ef4444 ${threshold}%, #22c55e ${threshold}%, #22c55e 100%)`
    : `linear-gradient(90deg, #22c55e 0%, #22c55e ${threshold}%, #ef4444 ${threshold}%, #ef4444 100%)`;

  return (
    <div className="mx-auto w-full max-w-[565px] pt-12 max-[767px]:pt-20">
      <div className="relative rounded-2xl border-[6px] border-[#1B222D] bg-[#101722] px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
        {resultPosition && visibleResult ? (
          <div
            className="absolute -top-14 z-10 -translate-x-1/2"
            style={{ left: resultPosition }}
          >
            <div
              className={[
                "rounded-md border px-3 py-2 text-xs font-bold text-white shadow-lg",
                visibleResult.didWin
                  ? "border-[#22c55e66] bg-[#14532d]"
                  : "border-[#ef444466] bg-[#3b1f2a]",
              ].join(" ")}
            >
              {visibleResult.randomValue.toFixed(2)}
            </div>
            <Image
              alt=""
              aria-hidden="true"
              className="mx-auto -mt-0.5 h-3 w-4"
              src={resultPolygonIcon}
            />
          </div>
        ) : null}

        <div className="relative h-5">
          <div
            className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
            style={{ background: gradient }}
          />
          <input
            aria-label="Dice rollover threshold"
            className="dice-range-input absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
            disabled={isLoading}
            max={99.99}
            min={0.01}
            onChange={(event) => onThresholdChange(Number(event.target.value))}
            step={0.01}
            type="range"
            value={threshold}
          />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-7 w-9 -translate-x-1/2 -translate-y-1/2"
            src={rangeLineIcon}
            style={{ left: markerPosition }}
          />
        </div>
      </div>

      <div className="relative mt-3 h-7 text-lg font-bold text-white/90">
        {tickMarks.map((tick) => (
          <span
            className="absolute -translate-x-1/2"
            key={tick}
            style={{ left: `${tick}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
