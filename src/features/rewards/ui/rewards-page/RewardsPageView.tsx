"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import rewardsIcon from "@/assets/aside/rewards.svg";
import { Button } from "@/shared";

import { REWARDS_DEFAULT_QUERY } from "../../lib/reward-query";
import { useRewardClock } from "../../model/use-reward-clock";
import { useRewards } from "../../model/use-rewards";
import type { RewardSort } from "../../model/types";
import { RewardsGrid } from "./RewardsGrid";
import { RewardsPagination } from "./RewardsPagination";
import { RewardsToolbar } from "./RewardsToolbar";

export function RewardsPageView() {
  const [page, setPage] = useState(REWARDS_DEFAULT_QUERY.page);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<RewardSort>(REWARDS_DEFAULT_QUERY.sort);
  const nowMs = useRewardClock();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const query = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      sort,
      take: REWARDS_DEFAULT_QUERY.take,
    }),
    [debouncedSearch, page, sort],
  );

  const rewardsQuery = useRewards(query);
  const rewards = rewardsQuery.data;

  const handleSortChange = (nextSort: RewardSort) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-(--color-page) text-(--color-text-primary)">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-9 max-tablet:px-4 max-tablet:py-7">
        <header className="flex max-w-3xl flex-col gap-2">
          <div className="flex items-center gap-3">
            <Image alt="" height={28} src={rewardsIcon} width={28} />
            <h1 className="text-[32px] leading-tight font-semibold text-(--color-text-primary) max-tablet:text-2xl">
              Rewards
            </h1>
          </div>
          <p className="text-[16px] font-normal text-(--color-text-muted)">
            Explore current reward campaigns, community activations and timed
            offers.
          </p>
        </header>

        <RewardsToolbar
          onSearchChange={setSearch}
          onSortChange={handleSortChange}
          search={search}
          sort={sort}
        />

        {rewardsQuery.isError ? (
          <div className="rounded-lg border border-(--color-border-strong) bg-(--color-surface-control)/65 px-5 py-8 text-center">
            <p className="text-base font-bold text-(--color-text-primary)">
              Rewards could not be loaded
            </p>
            <p className="mt-1 text-sm text-(--color-text-subtle)">
              Please try again in a moment.
            </p>
            <Button
              className="mt-5"
              onClick={() => rewardsQuery.refetch()}
              type="button"
              variant="ghost"
            >
              Retry
            </Button>
          </div>
        ) : (
          <RewardsGrid
            isFetching={rewardsQuery.isFetching}
            nowMs={nowMs}
            rewards={rewards}
          />
        )}

        {rewards ? (
          <RewardsPagination
            currentPage={rewards.page}
            onPageChange={setPage}
            totalPages={rewards.totalPages}
          />
        ) : null}
      </div>
    </main>
  );
}
