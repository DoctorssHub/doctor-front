import Image from "next/image";
import type { StaticImageData } from "next/image";
import { formatPointsAmount } from "../../lib/points-exchange-format";

type BalanceBadgeProps = {
  balance: number;
  icon: StaticImageData;
};

export function BalanceBadge({ balance, icon }: BalanceBadgeProps) {
  return (
    <span className="flex h-[30px] shrink-0 items-center gap-1 rounded-[6px] border border-[#343B49] px-2 text-[13px] leading-[125%] font-bold text-[#FDFDFD] max-mobile:text-[11px]">
      <span className="text-[#697386]">Balance</span>
      <Image
        alt=""
        aria-hidden="true"
        className="size-4"
        height={16}
        src={icon}
        width={16}
      />
      {formatPointsAmount(balance)}
    </span>
  );
}
