import Image from "next/image";
import { formatBetAmount } from "@/entities/bet/lib/formatters";

type BetHistoryAmountProps = {
  amount: string;
  className?: string;
};

export function BetHistoryAmount({
  amount,
  className = "text-sm font-semibold text-(--color-text-primary) max-mobile:text-xs",
}: BetHistoryAmountProps) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-2 max-mobile:gap-1.5 ${className}`}
    >
      <Image
        src="/red-coin.svg"
        alt=""
        width={16}
        height={16}
        className="shrink-0"
        aria-hidden="true"
      />
      <span className="truncate tabular-nums">{formatBetAmount(amount)}</span>
    </span>
  );
}
