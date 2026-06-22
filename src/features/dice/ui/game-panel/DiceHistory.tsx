"use client";

import { useEffect, useState } from "react";
import type { DiceBetResponse } from "../../api/dice-types";

type DiceHistoryProps = {
  results: DiceBetResponse[];
};

type VisibleDiceHistoryResult = {
  key: string;
  result: DiceBetResponse;
  status: "entering" | "visible" | "exiting";
};

function getDiceHistoryKey(result: DiceBetResponse) {
  return `${result.betId}-${result.createdAt}`;
}

export function DiceHistory({ results }: DiceHistoryProps) {
  const [visibleResults, setVisibleResults] = useState<
    VisibleDiceHistoryResult[]
  >([]);

  useEffect(() => {
    const nextResults = results.slice(-6);
    const nextKeys = new Set(nextResults.map(getDiceHistoryKey));

    const timeoutId = window.setTimeout(() => {
      setVisibleResults((currentResults) => {
        const currentByKey = new Map(
          currentResults.map((item) => [item.key, item]),
        );
        const enteringResults = nextResults
          .map((result) => {
            const key = getDiceHistoryKey(result);
            const currentResult = currentByKey.get(key);

            if (currentResult) {
              return { ...currentResult, result, status: "visible" as const };
            }

            return { key, result, status: "entering" as const };
          })
          .slice(-6);
        const exitingResults = currentResults
          .filter(
            (item) => !nextKeys.has(item.key) && item.status !== "exiting",
          )
          .map((item) => ({ ...item, status: "exiting" as const }));

        return [...exitingResults, ...enteringResults].slice(-7);
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [results]);

  useEffect(() => {
    const hasTransitioningItems = visibleResults.some(
      (item) => item.status === "entering" || item.status === "exiting",
    );

    if (!hasTransitioningItems) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleResults((currentResults) =>
        currentResults
          .filter((item) => item.status !== "exiting")
          .map((item) => ({ ...item, status: "visible" as const })),
      );
    }, 240);

    return () => window.clearTimeout(timeoutId);
  }, [visibleResults]);

  if (visibleResults.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Recent dice results"
      className="absolute right-7 top-7 z-10 flex flex-wrap justify-end gap-2 max-laptop:right-4 max-laptop:top-4 max-tablet:left-4"
    >
      {visibleResults.map(({ key, result, status }) => (
        <div
          className={`grid h-8 w-12 place-items-center rounded-[6px] px-1 py-2 text-center text-xs font-semibold leading-[1.33] ${
            status === "exiting"
              ? "dice-history-chip-out"
              : "dice-history-chip-in"
          } ${
            result.didWin
              ? "bg-[#22c55e] text-[#0a0d19]"
              : "bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] text-white"
          }`}
          key={key}
        >
          {result.randomValue.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
