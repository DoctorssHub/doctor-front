import Image from "next/image";
import type { StaticImageData } from "next/image";
import coinIcon from "@/assets/BetCointIcon.svg";
import coinBagImage from "@/assets/profile/coin-bag.png";
import coinsImage from "@/assets/profile/coins.png";
import type { ProfileStats } from "../../api/profile-types";

type ProfileStatisticsProps = {
  stats?: ProfileStats;
  isLoading: boolean;
};

export function ProfileStatistics({
  stats,
  isLoading,
}: ProfileStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 max-tablet:grid-cols-1">
      <StatCard
        image={coinBagImage}
        isLoading={isLoading}
        label="Total wagered"
        value={stats?.totalWagered}
      />
      <StatCard
        image={coinsImage}
        isLoading={isLoading}
        label="Wager points spent"
        value={stats?.wagerPointsSpent}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  image,
  isLoading,
}: {
  label: string;
  value?: string;
  image: StaticImageData;
  isLoading: boolean;
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
          <Image alt="Game points coin" className="size-[20px]" src={coinIcon} />
          {isLoading ? "—" : (value ?? "0.00")}
        </p>
      </div>
    </div>
  );
}
