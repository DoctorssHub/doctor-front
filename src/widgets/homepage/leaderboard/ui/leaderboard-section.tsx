import Image from "next/image";

import avatarOne from "@/assets/homepage/avatar-one.png";
import avatarThree from "@/assets/homepage/avatar-three.png";
import avatarTwo from "@/assets/homepage/avatar-two.png";
import trophyBronze from "@/assets/homepage/trophy-bronze.svg";
import trophyGold from "@/assets/homepage/trophy-gold.svg";
import { Button } from "@/shared/ui/button";

const players = [
  { avatar: avatarOne, prize: "1,500.00", score: "1,234,567", trophy: trophyBronze },
  { avatar: avatarTwo, prize: "1,500.00", score: "1,234,567", trophy: trophyGold, winner: true },
  { avatar: avatarThree, prize: "1,500.00", score: "1,234,567", trophy: trophyBronze },
];

export function LeaderboardSection() {
  return (
    <section className="relative overflow-hidden py-10 text-center">
      <div className="absolute inset-x-0 bottom-0 mx-auto h-64 max-w-4xl rounded-full bg-(--color-accent-blue)/20 blur-3xl" />
      <div className="relative">
        <h2 className="text-3xl font-black uppercase text-white sm:text-4xl">Monthly Leaderboard</h2>
        <p className="mt-3 text-sm text-(--color-text-muted)">
          Players who wager using code <span className="font-bold text-white">THEDOCTOR</span> on DegenCity are automatically entered
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end">
          {players.map((player, index) => (
            <article
              className={`relative w-44 rounded-xl border border-(--color-border-leaderboard) bg-(--color-surface-card) p-4 shadow-(--shadow-inset-soft) ${
                player.winner ? "md:-translate-y-8" : ""
              }`}
              key={`${player.score}-${index}`}
            >
              <Image alt="" className="mx-auto rounded-full border-2 border-(--color-brand) object-cover" height={80} src={player.avatar} width={80} />
              <Image alt="" className="absolute left-1/2 top-[72px] -translate-x-1/2" height={32} src={player.trophy} width={32} />
              <h3 className="mt-5 font-black">Username</h3>
              <p className="text-xs text-(--color-text-muted)">wagered</p>
              <p className="mt-1 text-sm font-bold text-white">{player.score}</p>
              <div className="mt-3 rounded-lg bg-(--color-surface-prize) px-3 py-2 font-black">$ {player.prize}</div>
            </article>
          ))}
        </div>
        <Button className="mt-3" variant="ghost">
          View all
        </Button>
      </div>
    </section>
  );
}
