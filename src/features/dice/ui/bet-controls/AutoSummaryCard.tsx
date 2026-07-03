import Image from "next/image";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type AutoSummaryCardProps = {
  coin?: boolean;
  label: string;
  value: string;
};

export function AutoSummaryCard({
  coin = false,
  label,
  value,
}: AutoSummaryCardProps) {
  return (
    <div className="h-[60px] w-[150px] rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 backdrop-blur-[4.8px]">
      <p className="text-xs font-semibold text-[#6b7280]">{label}</p>
      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#fdfdfd]">
        {coin ? (
          <Image
            src={redCoinIcon}
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
        ) : null}
        {value}
      </div>
    </div>
  );
}
