"use client";

import type { GameType } from "@/entities/bet/model/types";
import type {
  BetHistoryLiveCategory,
  BetHistoryVariant,
} from "@/features/bet-history/model/types";
import {
  BET_HISTORY_GAME_TABS,
  BET_HISTORY_LIVE_TABS,
} from "@/widgets/bet-history/model/config";

type BetHistoryTabsProps = {
  activeGame?: GameType;
  activeLiveCategory: BetHistoryLiveCategory;
  onGameChange: (game?: GameType) => void;
  onLiveCategoryChange: (category: BetHistoryLiveCategory) => void;
  variant: BetHistoryVariant;
};

export function BetHistoryTabs({
  activeGame,
  activeLiveCategory,
  onGameChange,
  onLiveCategoryChange,
  variant,
}: BetHistoryTabsProps) {

  return (
    <div
      aria-label={
        variant === "profile" ? "Filter bet history by game" : "Filter live bets"
      }
      className="flex max-w-full overflow-x-auto rounded-lg border border-(--color-border-strong) bg-(--color-surface-icon)/40 p-1"
      role="group"
    >
      <div className="flex min-w-max gap-1">
        {variant === "profile"
          ? BET_HISTORY_GAME_TABS.map((tab) => (
              <button
                aria-pressed={tab.value === activeGame}
                className={`h-9 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition max-mobile:px-2 max-mobile:text-xs ${
                  tab.value === activeGame
                    ? "bg-(--color-accent-red) text-white shadow-[0_0_24px_rgb(239_68_68/28%)]"
                    : "text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-white"
                }`}
                key={tab.label}
                onClick={() => {
                  onGameChange(tab.value);
                }}
                type="button"
              >
                {tab.label}
              </button>
            ))
          : BET_HISTORY_LIVE_TABS.map((tab) => (
              <button
                aria-pressed={tab.value === activeLiveCategory}
                className={`h-9 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition max-mobile:px-2 max-mobile:text-xs ${
                  tab.value === activeLiveCategory
                    ? "bg-(--color-accent-red) text-white shadow-[0_0_24px_rgb(239_68_68/28%)]"
                    : "text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-white"
                }`}
                key={tab.label}
                onClick={() => {
                  onLiveCategoryChange(tab.value);
                }}
                type="button"
              >
                {tab.label}
              </button>
            ))}
      </div>
    </div>
  );
}
