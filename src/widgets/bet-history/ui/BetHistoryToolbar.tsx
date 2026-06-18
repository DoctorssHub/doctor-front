"use client";

import { useState } from "react";
import type { BetHistorySort } from "@/features/bet-history/model/types";
import { BET_HISTORY_SORT_OPTIONS } from "@/widgets/bet-history/model/config";

type BetHistoryToolbarProps = {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: BetHistorySort) => void;
  search: string;
  sort: BetHistorySort;
};

export function BetHistoryToolbar({
  onSearchChange,
  onSortChange,
  search,
  sort,
}: BetHistoryToolbarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeSortLabel =
    BET_HISTORY_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    BET_HISTORY_SORT_OPTIONS[0].label;

  const handleSortSelect = (nextSort: BetHistorySort) => {
    onSortChange(nextSort);
    setIsSortOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-(--color-border-strong) bg-(--color-surface-icon)/40 px-3 text-sm text-(--color-text-muted) max-mobile:basis-full">
        <span className="shrink-0 text-xs font-semibold text-(--color-text-subtle)">
          Search
        </span>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-disabled)"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Enter the text"
          type="search"
          value={search}
        />
      </label>
      <div className="relative max-mobile:w-full">
        <button
          aria-expanded={isSortOpen}
          aria-haspopup="listbox"
          className="flex h-10 w-full shrink-0 items-center justify-between gap-2 rounded-lg border border-(--color-border-strong) bg-(--color-surface-icon)/40 px-4 text-sm font-semibold text-(--color-text-muted) transition hover:bg-(--color-surface-hover) hover:text-white"
          onClick={() => setIsSortOpen((open) => !open)}
          type="button"
        >
          <span>
            Sort by:{" "}
            <span className="text-(--color-accent-yellow)">{activeSortLabel}</span>
          </span>
          <span
            aria-hidden="true"
            className={`text-xs transition-transform ${isSortOpen ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
        {isSortOpen ? (
          <>
            <button
              aria-hidden="true"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setIsSortOpen(false)}
              tabIndex={-1}
              type="button"
            />
            <ul
              className="absolute right-0 z-20 mt-2 min-w-40 overflow-hidden rounded-lg border border-(--color-border-strong) bg-(--color-surface-elevated) py-1 shadow-[0_12px_32px_rgb(0_0_0/45%)]"
              role="listbox"
            >
              {BET_HISTORY_SORT_OPTIONS.map((option) => (
                <li key={option.value} role="option" aria-selected={option.value === sort}>
                  <button
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold transition hover:bg-(--color-surface-hover) ${
                      option.value === sort
                        ? "text-(--color-accent-yellow)"
                        : "text-(--color-text-muted)"
                    }`}
                    onClick={() => handleSortSelect(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
