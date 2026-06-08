import Image from "next/image";
import Link from "next/link";

import type { Game } from "../model/games";
import { GameMark } from "./game-mark";

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      aria-label={`Play ${game.title}`}
      className="group relative block h-[230px] w-[275px] overflow-hidden rounded-xl border border-(--color-border) border-b-[3px] bg-(--color-surface-game) transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-text-primary) laptop:max-large:h-[190px] laptop:max-large:w-[228px] tablet:max-laptop:h-[191px] tablet:max-laptop:w-full max-tablet:h-[191px] max-tablet:w-full"
      href={game.href}
      style={{
        background: "#0e1519",
        borderBottomColor: game.accent,
        boxShadow: "inset 0 1px 0 0 rgba(195, 255, 239, 0.2)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--gradient-game-overlay)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-10 z-30 h-[120px] w-[180px] rounded-full opacity-80 blur-[89.4000015258789px] transition-[opacity,transform] duration-300 ease-out group-hover:scale-125 group-hover:opacity-100"
        style={{ backgroundColor: game.blurColor }}
      />
      <div className="absolute right-0 bottom-0 z-20 h-[220px] w-[240px] origin-bottom-right transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-1 group-hover:scale-110">
        <Image
          alt={`${game.title} game preview`}
          className="object-contain object-right-bottom"
          fill
          sizes="280px"
          src={game.image}
        />
      </div>
      <GameMark
        gradientEnd={game.gradientEnd}
        gradientId={game.gradientId}
        gradientStart={game.gradientStart}
      />
      <div className="absolute inset-0 z-30 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-full" />
      <h3 className="relative z-30 p-4 text-[24px] font-semibold text-(--color-text-primary)">
        {game.title}
      </h3>
    </Link>
  );
}
