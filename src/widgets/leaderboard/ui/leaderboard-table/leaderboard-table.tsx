"use client";

import { useState } from "react";

import { useLatestLeaderboard } from "@/features/leaderboard";
import { Button } from "@/shared";

import {
  LEADERBOARD_INITIAL_TAKE,
  LEADERBOARD_TAKE_STEP,
} from "./leaderboard-table.constants";
import { LeaderboardTableView } from "./leaderboard-table-view";

export function LeaderboardTable() {
  const [visibleCount, setVisibleCount] = useState(LEADERBOARD_INITIAL_TAKE);
  const leaderboardQuery = useLatestLeaderboard(visibleCount);
  const participants = leaderboardQuery.data?.participants.items ?? [];
  const totalItems = leaderboardQuery.data?.participants.totalItems ?? 0;
  const canShowMore = participants.length < totalItems;

  return (
    <section className="mx-auto mt-10 flex w-full flex-col items-center">
      <LeaderboardTableView
        hasError={Boolean(leaderboardQuery.error)}
        isLoading={leaderboardQuery.isLoading}
        items={participants}
        onRetry={() => {
          void leaderboardQuery.refetch();
        }}
      />

      {canShowMore ? (
        <Button
          className="mt-6 block h-12 px-7 text-[16px]"
          disabled={leaderboardQuery.isFetching}
          onClick={() => {
            setVisibleCount((count) => count + LEADERBOARD_TAKE_STEP);
          }}
          type="button"
          variant="ghost"
        >
          Show more
        </Button>
      ) : null}
    </section>
  );
}
