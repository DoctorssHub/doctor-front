import Image from "next/image";

import type { Player } from "../model/players";
import { AvatarRank } from "./avatar-rank";
import BetIcon from "@/assets/homePage/leaderboardSection/betIcon.svg";

type LeaderboardCardProps = {
  className?: string;
  player: Player;
};

export function LeaderboardCard({
  className = "",
  player,
}: LeaderboardCardProps) {
  const cardBackground = player.winner
    ? "bg-[linear-gradient(180deg,#0f1228_0%,#1a2f58_100%)]"
    : "bg-[linear-gradient(180deg,#0f1228_0%,#212551_100%)]";

  return (
    <article
      className={`relative z-30 w-[250px] rounded-[18px] border border-(--color-border-leaderboard) p-6 shadow-(--shadow-inset-soft) max-tablet:h-[296px] max-tablet:w-[343px] max-tablet:p-4 ${cardBackground} ${
        player.winner ? "leaderboard-card-winner-offset" : ""
      } ${className}`}
    >
      <AvatarRank
        avatar={player.avatar}
        rank={player.rank}
        username={player.username}
      />
      <h3 className="mt-4 font-semibold text-[24px] text-(--color-text-primary) max-tablet:text-[20px]">
        {player.username}
      </h3>
      <p className="mt-4 text-sm uppercase text-(--color-text-muted) max-tablet:text-[14px]">
        wagered
      </p>
      <div className="flex items-center justify-center gap-1.5">
        <Image
          alt="Wager amount"
          className="h-5 w-5 shrink-0"
          src={BetIcon}
        />
        <p className=" text-[20px] font-semibold text-(--color-text-primary) max-tablet:text-[16px]">
          {player.score}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#060e16] py-4 font-semibold text-2xl text-(--color-text-primary) max-tablet:py-3 max-tablet:text-[20px]">
        <Image
          alt={`Rank ${player.prize} prize trophy`}
          className="h-auto w-5 shrink-0"
          src={player.trophy}
        />
        {player.prize}
      </div>
    </article>
  );
}
