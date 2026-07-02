import Image from "next/image";
import type { StaticImageData } from "next/image";
import { formatPointsAmount } from "../../lib/points-exchange-format";
import { BalanceBadge } from "./BalanceBadge";

type ReadonlyAmountFieldProps = {
  balance: number;
  icon: StaticImageData;
  label: string;
  value: number;
};

export function ReadonlyAmountField({
  balance,
  icon,
  label,
  value,
}: ReadonlyAmountFieldProps) {
  return (
    <div className="text-left">
      <p className="text-[14px] leading-[125%] font-medium text-[#C9CEDA]">
        {label}
      </p>
      <div className="mt-2 flex h-[52px] items-center gap-2 rounded-[6px] border border-[#252B36] bg-[#20232E] px-3">
        <Image
          alt=""
          aria-hidden="true"
          className="size-5"
          height={20}
          src={icon}
          width={20}
        />
        <span className="min-w-0 flex-1 text-[16px] leading-[125%] font-bold text-[#FDFDFD]">
          {formatPointsAmount(value)}
        </span>
        <BalanceBadge balance={balance} icon={icon} />
      </div>
    </div>
  );
}
