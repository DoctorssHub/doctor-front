import type { Player } from "../model/players";
import { AvatarRank } from "./avatar-rank";

type LeaderboardCardProps = {
  player: Player;
};

export function LeaderboardCard({ player }: LeaderboardCardProps) {
  return (
    <article
      className={`relative w-44 rounded-xl border border-(--color-border-leaderboard) bg-(--color-surface-card) p-4 shadow-(--shadow-inset-soft) ${
        player.winner ? "md:-translate-y-8" : ""
      }`}
    >
      <AvatarRank avatar={player.avatar} rank={player.rank} />
      <h3 className="mt-8 font-black">Username</h3>
      <p className="text-xs text-(--color-text-muted)">wagered</p>
      <p className="mt-1 text-sm font-bold text-white">{player.score}</p>
      <div className="mt-3 rounded-lg bg-(--color-surface-prize) px-3 py-2 font-black">
        $ {player.prize}
      </div>
    </article>
  );
}
