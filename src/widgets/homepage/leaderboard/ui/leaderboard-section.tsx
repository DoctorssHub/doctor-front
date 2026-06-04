import { Button } from "@/shared/ui/button";

import { players } from "../model/players";
import { LeaderboardCard } from "./leaderboard-card";
import { LeaderboardGlow } from "./leaderboard-glow";

export function LeaderboardSection() {
  return (
    <section className="relative py-10 text-center">
      <LeaderboardGlow />
      <div className="relative z-10">
        <h2 className="text-3xl font-black uppercase text-white sm:text-4xl">
          Monthly Leaderboard
        </h2>
        <p className="mt-3 text-sm text-(--color-text-muted)">
          Players who wager using code{" "}
          <span className="font-bold text-white">THEDOCTOR</span> on DegenCity
          are automatically entered
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end">
          {players.map((player, index) => (
            <LeaderboardCard
              key={`${player.score}-${index}`}
              player={player}
            />
          ))}
        </div>
        <Button
          className="mt-3"
          variant="ghost"
        >
          View all
        </Button>
      </div>
    </section>
  );
}
