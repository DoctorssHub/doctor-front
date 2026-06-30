import Image from "next/image";

import oclockIcon from "@/assets/shared/oclockIcon.svg";

import {
  formatRewardCountdown,
  getRewardRemainingMs,
} from "../../lib/reward-countdown";

type RewardTimeLeftProps = {
  endDate: string;
  nowMs: number;
};

export function RewardTimeLeft({ endDate, nowMs }: RewardTimeLeftProps) {
  const remainingMs = getRewardRemainingMs(endDate, nowMs);
  const isExpired = remainingMs <= 0;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-[14px] leading-[129%] font-medium text-(--color-text-muted)">
        Time left:
      </span>
      <time
        className="inline-flex h-[30px] w-[137px] min-w-0 items-center gap-2 rounded-[8px] bg-[color-mix(in_srgb,var(--color-roulette-win-number-dark)_50%,transparent)] px-3 py-1.5 text-[14px] leading-[129%] font-medium text-(--color-text-muted)"
        dateTime={endDate}
      >
        <Image
          alt=""
          aria-hidden="true"
          height={13}
          src={oclockIcon}
          width={13}
        />
        <span className="truncate">
          {isExpired ? "Expired" : formatRewardCountdown(remainingMs)}
        </span>
      </time>
    </div>
  );
}
