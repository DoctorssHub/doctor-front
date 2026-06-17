import gameIcon from "@/assets/homePage/games/gamesIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";

import { games } from "../model/games";
import { GameCard } from "./game-card";

export function GamesSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="Games"
        icon={gameIcon}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard
            game={game}
            key={game.title}
          />
        ))}
      </div>
    </section>
  );
}
