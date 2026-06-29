import Image from "next/image";

import oclockIcon from "@/assets/shared/oclockIcon.svg";

import {
  formatRewardCountdown,
  getRewardRemainingMs,
} from "../lib/reward-countdown";
import type { Reward } from "../model/types";

type RewardCardProps = {
  nowMs: number;
  reward: Reward;
};

export function RewardCard({ nowMs, reward }: RewardCardProps) {
  const remainingMs = getRewardRemainingMs(reward.endDate, nowMs);
  const isExpired = remainingMs <= 0;

  return (
    <article className="group h-[374px] w-[303px] overflow-hidden rounded-[12px] border border-[#1b1f26] bg-(--color-surface-elevated) shadow-(--shadow-inset-soft) transition duration-300 hover:-translate-y-1 hover:border-(--color-border-control) hover:shadow-[0_3px_14px_0_rgba(34,197,94,0.09)] max-mobile:w-full">
      <div className="relative h-[200px] bg-(--color-surface-game)">
        <Image
          alt={reward.title}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          sizes="(max-width: 767px) 100vw, 280px"
          src={reward.photoUrl}
        />
      </div>
      <div className="flex h-[174px] flex-col justify-between bg-(--color-surface-icon)/80 p-5">
        <div className="min-w-0">
          <h2 className="truncate text-[20px] leading-[120%] font-semibold text-[#fdfdfd]">
            {reward.title}
          </h2>
          <p className="mt-2 line-clamp-2 min-h-10 text-[16px] leading-[125%] font-normal text-[#6b7280]">
            {reward.shortDescription}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 text-[14px] leading-[129%] font-medium text-[#c7cbd4]">
            Time left:
          </span>
          <time
            className="inline-flex h-[30px] w-[137px] min-w-0 items-center gap-2 rounded-[8px] bg-[rgba(43,48,59,0.5)] px-3 py-1.5 text-[14px] leading-[129%] font-medium text-[#c7cbd4]"
            dateTime={reward.endDate}
          >
            <Image
              alt=""
              aria-hidden="true"
              height={13}
              src={oclockIcon}
              width={13}
            />
            <span className="truncate">
              {isExpired
                ? "Expired"
                : formatRewardCountdown(remainingMs)}
            </span>
          </time>
        </div>
      </div>
    </article>
  );
}
