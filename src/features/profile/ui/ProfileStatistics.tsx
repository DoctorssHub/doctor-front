import Image from "next/image";
import type { StaticImageData } from "next/image";
import coinIcon from "@/assets/shared/red-coin.svg";
import coinBagImage from "@/assets/profile/coin-bag.png";
import coinsImage from "@/assets/profile/coins.png";

export function ProfileStatistics() {
  return (
    <div className="grid grid-cols-2 gap-4 max-tablet:grid-cols-1">
      <StatCard image={coinBagImage} label="Total wagered" value="0.00" />
      <StatCard image={coinsImage} label="Wager points spent" value="0.00" />
    </div>
  );
}

function StatCard({
  label,
  value,
  image,
}: {
  label: string;
  value: string;
  image: StaticImageData;
}) {
  return (
    <div className="relative flex min-h-20 items-center overflow-hidden rounded-xl bg-(--color-surface) py-3 pr-5 pl-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-2/5"
        style={{
          background:
            "radial-gradient(90% 130% at 0% 50%, rgba(34, 197, 94, 0.28) 0%, rgba(34, 197, 94, 0.08) 40%, transparent 68%)",
        }}
      />
      <Image
        alt={`${label} illustration`}
        className="pointer-events-none absolute -bottom-9 -left-10 h-36 w-36 rotate-12 object-contain"
        src={image}
      />
      <div className="relative min-w-0">
        <p className="truncate font-medium text-[14px] text-(--color-text-muted)">
          {label}
        </p>
        <p className="flex items-center gap-2 text-[18px] font-medium text-(--color-text-primary)">
          <Image
            alt="Game points coin"
            className="size-[20px]"
            src={coinIcon}
          />
          {value}
        </p>
      </div>
    </div>
  );
}
