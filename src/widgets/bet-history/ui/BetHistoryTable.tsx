"use client";

import { useState } from "react";
import { useAuthSessionStore } from "@/features/auth/model/auth-session-store";
import type { BetHistoryItem, GameType } from "@/entities/bet/model/types";
import type {
  BetHistoryLiveCategory,
  BetHistoryQueryParams,
} from "@/features/bet-history/model/types";
import { useBetHistory } from "@/features/bet-history/model/useBetHistory";
import { useLiveBetSocket } from "@/features/bet-history/model/useLiveBetSocket";
import {
  BET_HISTORY_DEFAULT_LIMIT,
  BET_HISTORY_PROFILE_PAGE_SIZE,
  GAME_SLUG_MAP,
} from "@/widgets/bet-history/model/config";
import { BetHistoryPagination } from "@/widgets/bet-history/ui/BetHistoryPagination";
import { BetHistoryRows } from "@/widgets/bet-history/ui/BetHistoryRows";
import { BetHistoryTabs } from "@/widgets/bet-history/ui/BetHistoryTabs";

type BetHistoryTableBaseProps = {
  className?: string;
  title?: string;
};

export type BetHistoryTableProps =
  | (BetHistoryTableBaseProps & {
      game?: never;
      userId?: string;
      variant: "profile";
    })
  | (BetHistoryTableBaseProps & {
      game?: never;
      userId?: never;
      variant: "games-live";
    })
  | (BetHistoryTableBaseProps & {
      game: GameType;
      userId?: never;
      variant: "game-live";
    });

function createQueryParams({
  activeGame,
  activeLiveCategory,
  limit,
  page,
  props,
}: {
  activeGame?: GameType;
  activeLiveCategory: BetHistoryLiveCategory;
  limit: number;
  page: number;
  props: BetHistoryTableProps;
}): BetHistoryQueryParams {
  switch (props.variant) {
    case "profile":
      return {
        variant: props.variant,
        gameSlug: activeGame ? GAME_SLUG_MAP[activeGame] : undefined,
        page,
        take: BET_HISTORY_PROFILE_PAGE_SIZE,
        userId: props.userId,
      };
    case "games-live":
      return {
        variant: props.variant,
        category: activeLiveCategory,
        limit,
        page: 1,
      };
    case "game-live":
      return {
        variant: props.variant,
        category: activeLiveCategory,
        game: props.game,
        limit,
        page: 1,
      };
  }
}

export function BetHistoryTable(props: BetHistoryTableProps) {
  const { className, title, variant } = props;
  const [activeGame, setActiveGame] = useState<GameType | undefined>();
  const [activeLiveCategory, setActiveLiveCategory] =
    useState<BetHistoryLiveCategory>("all");
  const [page, setPage] = useState(1);

  const isProfile = variant === "profile";

  const queryParams = createQueryParams({
    activeGame,
    activeLiveCategory,
    limit: BET_HISTORY_DEFAULT_LIMIT,
    page,
    props,
  });

  const query = useBetHistory(queryParams);
  const username = useAuthSessionStore((state) => state.username);

  useLiveBetSocket(queryParams, !isProfile, username);

  const rawItems: BetHistoryItem[] = query.data?.items ?? [];
  const items: BetHistoryItem[] =
    isProfile && username
      ? rawItems.map((item) => ({
          ...item,
          user: { ...item.user, name: username },
        }))
      : rawItems;

  const totalPages = isProfile ? (query.data?.totalPages ?? 1) : 1;

  const resolvedTitle =
    title ?? (variant === "profile" ? "Bets history" : "Bet Live");
  const shouldShowTitle = variant !== "game-live" || title !== undefined;

  const handleGameChange = (nextGame?: GameType) => {
    setActiveGame(nextGame);
    setPage(1);
  };

  const handleLiveCategoryChange = (
    nextLiveCategory: BetHistoryLiveCategory,
  ) => {
    setActiveLiveCategory(nextLiveCategory);
  };

  return (
    <section className={`space-y-4 ${className ?? ""}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {shouldShowTitle ? (
          <h2 className="text-xl font-semibold tracking-normal text-(--color-text-primary) max-mobile:text-lg">
            {resolvedTitle}
          </h2>
        ) : null}
        <BetHistoryTabs
          activeGame={activeGame}
          activeLiveCategory={activeLiveCategory}
          onGameChange={handleGameChange}
          onLiveCategoryChange={handleLiveCategoryChange}
          variant={variant}
        />
      </div>

      <BetHistoryRows
        error={query.error}
        isLoading={query.isLoading}
        items={items}
        onRetry={() => {
          void query.refetch();
        }}
      />

      {isProfile ? (
        <BetHistoryPagination
          onPageChange={setPage}
          page={page}
          totalPages={totalPages}
        />
      ) : null}
    </section>
  );
}
