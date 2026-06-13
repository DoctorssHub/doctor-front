"use client";

import { useEffect } from "react";
import { ROULETTE_RED_NUMBERS } from "../../model/roulette-constants";
import type { RouletteResult } from "../../model/use-roulette-store";

type RouletteHistoryProps = {
  results: RouletteResult[];
  onExitComplete: () => void;
};

function getResultColorClass(number: number) {
  if (number === 0) {
    return "bg-[var(--color-roulette-history-green)] shadow-[var(--shadow-roulette-history-green)]";
  }

  if (ROULETTE_RED_NUMBERS.has(number)) {
    return "bg-[var(--color-roulette-history-red)] shadow-[var(--shadow-roulette-history-red)]";
  }

  return "bg-[var(--color-roulette-history-dark)] shadow-[var(--shadow-roulette-history-dark)]";
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
      className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col justify-start gap-2 max-tablet:top-1/2 max-tablet:left-4 max-tablet:-translate-y-1/2"
    >
      {results.map((result, index) => {
        const isExiting = hasOverflowResult && index === 0;

        return (
          <div
            className={[
              "grid h-10 w-10 place-items-center overflow-hidden rounded-[4px] text-center text-sm font-semibold leading-[129%] text-[var(--color-text-primary)] transition-[max-height,opacity,transform,margin] duration-300 ease-out",
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
