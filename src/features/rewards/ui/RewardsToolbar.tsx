"use client";

import { useState } from "react";
import Image from "next/image";

import searchIcon from "@/assets/shared/searchIcon.svg";

import type { RewardSort } from "../model/types";

const REWARD_SORT_OPTIONS: { label: string; value: RewardSort }[] = [
  {
    label: "By creation",
    value: "createdAtDesc",
  },
];

type RewardsToolbarProps = {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: RewardSort) => void;
  search: string;
  sort: RewardSort;
};

export function RewardsToolbar({
  onSearchChange,
  onSortChange,
  search,
  sort,
}: RewardsToolbarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const activeSortLabel =
    REWARD_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    REWARD_SORT_OPTIONS[0].label;

  const handleSortSelect = (nextSort: RewardSort) => {
    onSortChange(nextSort);
    setIsSortOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-(--color-border-strong) bg-(--color-surface-control)/65 px-3 max-mobile:basis-full">
        <Image alt="" aria-hidden="true" height={16} src={searchIcon} width={16} />
        <input
          className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#fdfdfd] outline-none placeholder:text-[#6b7280]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search rewards"
          type="search"
          value={search}
        />
      </label>
      <div className="relative max-mobile:w-full">
        <button
          aria-expanded={isSortOpen}
          aria-haspopup="listbox"
          className="flex h-12 w-full shrink-0 items-center justify-between gap-3 rounded-lg border border-(--color-border-strong) bg-(--color-surface-control)/65 px-4 text-[14px] leading-[129%] font-medium text-[#6b7280] transition hover:bg-(--color-surface-hover)"
          onClick={() => setIsSortOpen((open) => !open)}
          type="button"
        >
          <span>
            Sort by:{" "}
            <span className="text-[14px] leading-[129%] font-medium text-[#22c55e]">
              {activeSortLabel}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`size-2 rotate-45 border-r-2 border-b-2 border-(--color-text-muted) transition-transform ${
              isSortOpen ? "rotate-[225deg]" : ""
            }`}
          />
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
              className="absolute right-0 z-20 mt-2 min-w-44 overflow-hidden rounded-lg border border-(--color-border-strong) bg-(--color-surface-elevated) py-1 shadow-[0_12px_32px_rgb(0_0_0/45%)]"
              role="listbox"
            >
              {REWARD_SORT_OPTIONS.map((option) => (
                <li
                  aria-selected={option.value === sort}
                  key={option.value}
                  role="option"
                >
                  <button
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold transition hover:bg-(--color-surface-hover) ${
                      option.value === sort
                        ? "text-[#22c55e]"
                        : "text-[#6b7280]"
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
