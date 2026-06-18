"use client";

import type { DiceBetResponse } from "../../api/dice-types";

type DiceHistoryProps = {
  results: DiceBetResponse[];
};

export function DiceHistory({ results }: DiceHistoryProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Recent dice results"
      className="absolute right-7 top-7 z-10 flex flex-wrap justify-end gap-2 max-[1023px]:right-4 max-[1023px]:top-4 max-[767px]:left-4 max-[767px]:justify-start"
    >
      {results.slice(-6).map((result) => (
        <div
          className={[
            "grid h-8 min-w-11 place-items-center rounded-md px-3 text-xs font-bold text-white shadow-[var(--shadow-inset-soft)]",
            result.didWin
              ? "bg-[var(--color-brand)] text-black"
              : "bg-[#252B36]",
          ].join(" ")}
          key={`${result.betId}-${result.createdAt}`}
        >
          {result.randomValue.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
