import Image from "next/image";
import type { StaticImageData } from "next/image";

type ExchangeRateCardProps = {
  icon: StaticImageData;
  label: string;
};

export function ExchangeRateCard({ icon, label }: ExchangeRateCardProps) {
  return (
    <div className="flex h-[52px] items-center justify-center gap-2 rounded-[6px] bg-[#20232E] px-4 text-[16px] leading-[125%] font-bold text-[#DDE2EC]">
      <Image
        alt=""
        aria-hidden="true"
        className="size-6"
        height={24}
        src={icon}
        width={24}
      />
      <span>{label}</span>
    </div>
  );
}
