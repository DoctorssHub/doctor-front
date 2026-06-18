"use client";

import { useState } from "react";
import { useAuthSessionStore } from "@/features/auth/model/auth-session-store";
import type { BetHistoryItem, GameType } from "@/entities/bet/model/types";
import type {
  BetHistoryLiveCategory,
  BetHistoryQueryParams,
  BetHistorySort,
} from "@/features/bet-history/model/types";
import {
  useBetHistory,
  useUserBetHistory,
} from "@/features/bet-history/model/useBetHistory";
import { useLiveBetSocket } from "@/features/bet-history/model/useLiveBetSocket";
import {
  BET_HISTORY_DEFAULT_LIMIT,
  BET_HISTORY_PROFILE_PAGE_SIZE,
} from "@/widgets/bet-history/model/config";
import { BetHistoryPagination } from "@/widgets/bet-history/ui/BetHistoryPagination";
import { BetHistoryRows } from "@/widgets/bet-history/ui/BetHistoryRows";
import { BetHistoryTabs } from "@/widgets/bet-history/ui/BetHistoryTabs";
import { BetHistoryToolbar } from "@/widgets/bet-history/ui/BetHistoryToolbar";

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

type CreateQueryParamsInput = {
  activeGame?: GameType;
  activeLiveCategory: BetHistoryLiveCategory;
  limit: number;
  page: number;
  props: BetHistoryTableProps;
  search: string;
  sort: BetHistorySort;
};

function createQueryParams({
  activeGame,
  activeLiveCategory,
  limit,
  page,
  props,
  search,
  sort,
}: CreateQueryParamsInput): BetHistoryQueryParams {
  switch (props.variant) {
    case "profile":
      return {
        variant: props.variant,
        game: activeGame,
        page,
        take: limit,
        search,
        sort,
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BetHistorySort>("date");

  const queryParams = createQueryParams({
    activeGame,
    activeLiveCategory,
    limit: BET_HISTORY_DEFAULT_LIMIT,
    page,
    props,
    search,
    sort,
  });

  const isProfile = variant === "profile";

  const liveQuery = useBetHistory(queryParams, { enabled: !isProfile });
  const profileQuery = useUserBetHistory({ enabled: isProfile });
  const username = useAuthSessionStore((state) => state.username);

  useLiveBetSocket(queryParams, !isProfile, username);

  // Profile: full history is fetched once, then filtered by game (tabs + search)
  // and paginated on the client (the backend has no filter on `/bets/my`).
  const searchTerm = search.trim().toLowerCase();
  const profileFilteredItems = (profileQuery.data ?? []).filter((item) => {
    const matchesGameTab = !activeGame || item.game.toLowerCase() === activeGame;
    const matchesSearch =
      !searchTerm || item.game.toLowerCase().includes(searchTerm);

    return matchesGameTab && matchesSearch;
  });
  const profileSortedItems = [...profileFilteredItems].sort((a, b) =>
    sort === "win"
      ? Number(b.prize) - Number(a.prize)
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const profileTotalPages = Math.max(
    1,
    Math.ceil(profileSortedItems.length / BET_HISTORY_PROFILE_PAGE_SIZE),
  );
  const profilePageItems = profileSortedItems.slice(
    (page - 1) * BET_HISTORY_PROFILE_PAGE_SIZE,
    page * BET_HISTORY_PROFILE_PAGE_SIZE,
  );

  const rawItems: BetHistoryItem[] = isProfile
    ? profilePageItems
    : (liveQuery.data?.items ?? []);
  const items: BetHistoryItem[] =
    isProfile && username
      ? rawItems.map((item) => ({
          ...item,
          user: { ...item.user, name: username },
        }))
      : rawItems;

  const error = isProfile ? profileQuery.error : liveQuery.error;
  const isLoading = isProfile ? profileQuery.isLoading : liveQuery.isLoading;
  const totalPages = isProfile ? profileTotalPages : 1;
  const refetch = isProfile ? profileQuery.refetch : liveQuery.refetch;

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

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    setPage(1);
  };

  const handleSortChange = (nextSort: BetHistorySort) => {
    setSort(nextSort);
    setPage(1);
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

      {isProfile ? (
        <BetHistoryToolbar
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          search={search}
          sort={sort}
        />
      ) : null}

      <BetHistoryRows
        error={error}
        isLoading={isLoading}
        items={items}
        onRetry={() => {
          void refetch();
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
