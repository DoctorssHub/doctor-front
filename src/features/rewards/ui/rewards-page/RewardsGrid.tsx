import type { RewardsResponse } from "../../model/types";
import { RewardCard } from "../reward-card";

type RewardsGridProps = {
  isFetching: boolean;
  nowMs: number;
  rewards?: RewardsResponse;
};

export function RewardsGrid({ isFetching, nowMs, rewards }: RewardsGridProps) {
  if (!rewards && isFetching) {
    return <RewardsGridSkeleton />;
  }

  if (!rewards || rewards.items.length === 0) {
    return (
      <div className="rounded-lg border border-(--color-border-strong) bg-(--color-surface-control)/65 px-5 py-10 text-center">
        <p className="text-base font-bold text-(--color-text-primary)">
          No rewards found
        </p>
        <p className="mt-1 text-sm text-(--color-text-subtle)">
          Try another search term or come back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,303px)] gap-4 max-mobile:grid-cols-1">
      {rewards.items.map((reward, index) => (
        <RewardCard
          className={`rewards-card-entrance rewards-card-entrance-${(index % 8) + 1}`}
          key={reward.id}
          nowMs={nowMs}
          reward={reward}
        />
      ))}
    </div>
  );
}

function RewardsGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,303px)] gap-4 max-mobile:grid-cols-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="h-[374px] w-[303px] overflow-hidden rounded-[12px] border border-(--color-border-strong) bg-(--color-surface-elevated) max-mobile:w-full"
          key={index}
        >
          <div className="h-[200px] animate-pulse bg-(--color-surface-hover)" />
          <div className="h-[174px] space-y-3 bg-(--color-surface-icon)/80 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-(--color-surface-hover)" />
            <div className="h-3 w-full animate-pulse rounded bg-(--color-surface-hover)" />
            <div className="h-8 w-full animate-pulse rounded-lg bg-(--color-surface-hover)" />
          </div>
        </div>
      ))}
    </div>
  );
}
