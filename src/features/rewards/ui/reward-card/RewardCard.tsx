import Image from "next/image";
import Link from "next/link";

import type { Reward } from "../../model/types";
import { RewardTimeLeft } from "./RewardTimeLeft";

type RewardCardProps = {
  nowMs: number;
  reward: Reward;
};

export function RewardCard({ nowMs, reward }: RewardCardProps) {
  return (
    <Link
      aria-label={`Open ${reward.title}`}
      className="group relative block h-[374px] w-[303px] cursor-pointer overflow-hidden rounded-[12px] border border-(--color-border-strong) bg-(--color-surface-elevated) shadow-(--shadow-inset-soft) transition-[box-shadow] duration-300 hover:shadow-[0_3px_14px_0_rgba(34,197,94,0.09)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22c55e] max-mobile:w-full"
      href={`/rewards/${reward.id}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-0 z-30 h-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(34, 197, 94, 0.03) 0%, rgba(34, 197, 94, 0.24) 24%, rgba(34, 197, 94, 0.46) 58%, rgba(34, 197, 94, 0.18) 84%, rgba(34, 197, 94, 0.04) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-0 z-30 h-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(34, 197, 94, 0.03) 0%, rgba(34, 197, 94, 0.24) 24%, rgba(34, 197, 94, 0.46) 58%, rgba(34, 197, 94, 0.18) 84%, rgba(34, 197, 94, 0.04) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 bottom-6 left-0 z-30 w-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(34, 197, 94, 0.14) 0%, rgba(34, 197, 94, 0.06) 46%, rgba(34, 197, 94, 0) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-0 bottom-6 z-30 w-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.07) 48%, rgba(34, 197, 94, 0) 100%)",
        }}
      />
      <article>
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
            <h2 className="truncate text-[20px] leading-[120%] font-semibold text-(--color-text-primary)">
              {reward.title}
            </h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-[16px] leading-[125%] font-normal text-[#6b7280]">
              {reward.shortDescription}
            </p>
          </div>
          <RewardTimeLeft endDate={reward.endDate} nowMs={nowMs} />
        </div>
      </article>
    </Link>
  );
}
