"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared";

import { useRewardClock } from "../../model/use-reward-clock";
import { useRewardDetails } from "../../model/use-rewards";
import { RewardContentRenderer } from "./RewardContentRenderer";
import { RewardTimeLeft } from "../reward-card";

type RewardDetailsPageViewProps = {
  rewardId: string;
};

export function RewardDetailsPageView({
  rewardId,
}: RewardDetailsPageViewProps) {
  const nowMs = useRewardClock();
  const rewardQuery = useRewardDetails(rewardId);
  const reward = rewardQuery.data;

  return (
    <main className="min-h-screen bg-(--color-page) text-(--color-text-primary)">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-6 py-9 max-tablet:px-4 max-tablet:py-7">
        <Link
          className="inline-flex w-fit items-center gap-3 text-[18px] leading-[133%] font-medium text-(--color-text-primary) transition hover:text-(--color-brand)"
          href="/rewards"
        >
          <span
            aria-hidden="true"
            className="size-2 rotate-45 border-b-2 border-l-2 border-current"
          />
          Back
        </Link>

        {rewardQuery.isLoading ? (
          <RewardDetailsSkeleton />
        ) : null}

        {rewardQuery.isError ? (
          <div className="rounded-2xl border border-(--color-border-strong) bg-(--color-surface-control)/65 px-5 py-8 text-center">
            <p className="text-[24px] leading-[133%] font-semibold text-(--color-text-primary)">
              Reward could not be loaded
            </p>
            <p className="mt-2 text-[18px] leading-[133%] font-normal text-[#6b7280]">
              Please try again in a moment.
            </p>
            <Button
              className="mt-5"
              onClick={() => rewardQuery.refetch()}
              type="button"
              variant="ghost"
            >
              Retry
            </Button>
          </div>
        ) : null}

        {reward ? (
          <article className="flex flex-col gap-5">
            <div className="relative h-100 overflow-hidden rounded-[16px] bg-[#12171d] max-tablet:h-65 max-mobile:h-[220px]">
              <Image
                alt={reward.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 900px"
                src={reward.photoUrl}
              />
            </div>
            <div className="flex items-start justify-between gap-6 max-tablet:flex-col max-tablet:gap-4">
              <h1 className="text-[24px] leading-[133%] font-semibold text-(--color-text-primary)">
                {reward.title}
              </h1>
              <RewardTimeLeft endDate={reward.endDate} nowMs={nowMs} />
            </div>
            <RewardContentRenderer content={reward.content} />
          </article>
        ) : null}
      </div>
    </main>
  );
}

function RewardDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-[328px] animate-pulse rounded-[16px] bg-(--color-surface-hover) max-tablet:h-[260px] max-mobile:h-[220px]" />
      <div className="flex items-start justify-between gap-6">
        <div className="h-8 w-72 animate-pulse rounded bg-(--color-surface-hover)" />
        <div className="h-[30px] w-[220px] animate-pulse rounded-[8px] bg-(--color-surface-hover)" />
      </div>
      <div className="h-20 animate-pulse rounded bg-(--color-surface-hover)" />
    </div>
  );
}
