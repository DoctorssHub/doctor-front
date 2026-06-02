import Image from "next/image";

import { figmaAssets } from "@/shared/config/figma-assets";
import { SectionTitle } from "@/shared/ui/section-title";

const games = [
  { accent: "var(--color-accent-purple)", image: figmaAssets.gameDice, title: "Dice" },
  { accent: "var(--color-accent-red)", image: figmaAssets.gameRoulette, title: "Roulette" },
  { accent: "var(--color-accent-yellow)", image: figmaAssets.gameKeno, title: "Keno" },
  { accent: "var(--color-brand)", image: figmaAssets.gamePlinko, title: "Plinko" },
];

export function GamesSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle title="Games" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <article
            className="relative h-[150px] overflow-hidden rounded-xl border border-[var(--color-border)] border-b-[3px] bg-[var(--color-surface-game)]"
            key={game.title}
            style={{ borderBottomColor: game.accent }}
          >
            <Image alt="" className="object-cover" fill src={game.image} />
            <div className="absolute inset-0 bg-[image:var(--gradient-game-overlay)]" />
            <h3 className="relative p-4 text-xl font-black text-white">{game.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
