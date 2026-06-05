import Image from "next/image";

import type { Player } from "../model/players";
import { AvatarRank } from "./avatar-rank";
import BetIcon from "@/assets/betIcon.svg";

type LeaderboardCardProps = {
  player: Player;
};

export function LeaderboardCard({ player }: LeaderboardCardProps) {
  const cardBackground = player.winner
    ? "bg-[linear-gradient(180deg,#0f1228_0%,#1a2f58_100%)]"
    : "bg-[linear-gradient(180deg,#0f1228_0%,#212551_100%)]";

  return (
    <article
      className={`relative z-30  w-[250px] rounded-[18px] border border-(--color-border-leaderboard) p-6 shadow-(--shadow-inset-soft) ${cardBackground} ${
        player.winner ? "md:-translate-y-8" : ""
      }`}
    >
      <AvatarRank avatar={player.avatar} rank={player.rank} />
      <h3 className="mt-4 font-semibold text-[24px] text-(--color-text-primary)">
        {player.username}
      </h3>
      <p className="text-sm uppercase text-(--color-text-muted) mt-4">wagered</p>
      <div className="flex items-center justify-center gap-1.5">
        <Image
          alt=""
          className="h-5 w-5 shrink-0"
          src={BetIcon}
        />
      <p className=" text-[20px] font-semibold text-(--color-text-primary)">
        {player.score}
      </p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#060e16]  py-4 font-semibold text-2xl text-(--color-text-primary)">
        <Image
          alt=""
          className="h-auto w-5 shrink-0"
          src={player.trophy}
        />
        {player.prize}
      </div>
    </article>
  );
}
