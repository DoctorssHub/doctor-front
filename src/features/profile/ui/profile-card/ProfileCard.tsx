import Image from "next/image";
import coinIcon from "@/assets/BetCointIcon.svg";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  formatPointsValue,
  getUsernameInitial,
} from "../../lib/profile-format";

type ProfileCardProps = {
  user: MeResponse;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const gamePoints = user.userBalances?.find(
    (balance) => balance.balanceType === "GAME_POINTS",
  );

  return (
    <section className="flex min-h-[146px] items-center justify-between gap-4 rounded-xl bg-(--color-surface) px-6 py-5 max-tablet:flex-col max-tablet:items-start max-tablet:gap-5 max-tablet:px-4">
      <div className="flex min-w-0 items-center gap-4">
        <ProfileAvatar imageUrl={user.profileImgUrl} username={user.username} />
        <div className="min-w-0">
          <p className="mb-1 truncate text-2xl font-semibold text-(--color-text-primary) max-tablet:text-xl">
            {user.username}
          </p>
          <p className="truncate text-sm text-(--color-text-subtle)">
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-(--color-surface-counter) px-4 py-2.5 max-tablet:self-stretch max-tablet:justify-center">
        <Image alt="Game points coin" className="size-5" src={coinIcon} />
        <span className="text-base font-semibold text-(--color-text-primary)">
          {formatPointsValue(gamePoints?.value ?? null)}
        </span>
      </div>
    </section>
  );
}

function ProfileAvatar({
  imageUrl,
  username,
}: {
  imageUrl: string | null;
  username: string;
}) {
  return (
    <span
      className="flex size-24 shrink-0 items-center justify-center rounded-full p-[2px] max-tablet:size-14"
      style={{
        background:
          "linear-gradient(0deg, #ff3b41 0%, #c82831 45%, #4a0a0d 100%)",
      }}
    >
      <span
        className="flex size-full items-center justify-center overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #3a1417 0%, #1a1016 55%, #120d12 100%)",
        }}
      >
        {imageUrl ? (
          <Image
            alt={`${username} avatar`}
            className="size-full origin-bottom -translate-x-0.5 translate-y-1.5 scale-110 object-cover"
            height={64}
            src={imageUrl}
            unoptimized
            width={64}
          />
        ) : (
          <span className="text-2xl font-bold text-(--color-text-primary)">
            {getUsernameInitial(username)}
          </span>
        )}
      </span>
    </span>
  );
}
