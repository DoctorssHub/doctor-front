"use client";

import { useEffect } from "react";
import type { RouletteResult } from "../model/use-roulette-store";
import { ROULETTE_RED_NUMBERS } from "../model/roulette-constants";

type RouletteHistoryProps = {
  results: RouletteResult[];
  onExitComplete: () => void;
};

function getResultColorClass(number: number) {
  if (number === 0) {
    return "bg-[#20c765] shadow-[0_8px_18px_rgb(32_199_101_/_18%)]";
  }

  if (ROULETTE_RED_NUMBERS.has(number)) {
    return "bg-[#ff3b3f] shadow-[0_8px_18px_rgb(255_59_63_/_18%)]";
  }

  return "bg-[#252b36] shadow-[0_8px_18px_rgb(0_0_0_/_18%)]";
}

export function RouletteHistory({
  results,
  onExitComplete,
}: RouletteHistoryProps) {
  const hasOverflowResult = results.length > 5;

  useEffect(() => {
    if (!hasOverflowResult) {
      return;
    }

    const timeout = window.setTimeout(onExitComplete, 300);

    return () => window.clearTimeout(timeout);
  }, [hasOverflowResult, onExitComplete]);

  if (results.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Recent roulette results"
      className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col justify-start gap-2"
    >
      {results.map((result, index) => {
        const isExiting = hasOverflowResult && index === 0;

        return (
          <div
            className={[
              "grid h-10 w-10 place-items-center overflow-hidden rounded-[4px] text-center text-sm font-semibold leading-[129%] text-[#fdfdfd] transition-[max-height,opacity,transform,margin] duration-300 ease-out",
              getResultColorClass(result.number),
              isExiting
                ? "max-h-0 -translate-x-3 opacity-0"
                : "max-h-10 translate-x-0 opacity-100",
            ].join(" ")}
            key={`${result.betId}-${result.createdAt}`}
          >
            {result.number}
          </div>
        );
      })}
    </div>
  );
}
