import { games } from "../model/games";
import { GameCard } from "./game-card";

type GamesGridProps = {
  variant?: "homepage" | "all-games";
};

export function GamesGrid({ variant = "homepage" }: GamesGridProps) {
  const isAllGames = variant === "all-games";

  return (
    <div
      className={
        isAllGames
          ? "mx-auto grid w-full max-w-[928px] grid-cols-2 gap-4 max-[767px]:grid-cols-1"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {games.map((game) => (
        <GameCard
          game={game}
          key={game.title}
          variant={isAllGames ? "wide" : "default"}
        />
      ))}
    </div>
  );
}
