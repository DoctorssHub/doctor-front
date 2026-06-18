import Image from "next/image";
import { formatBetAmount } from "@/entities/bet/lib/formatters";

type BetHistoryAmountProps = {
  amount: string;
};

export function BetHistoryAmount({ amount }: BetHistoryAmountProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
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
