import gameIcon from "@/assets/homePage/games/gamesIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";

import { GamesGrid } from "./games-grid";

export function GamesSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="Games"
        icon={gameIcon}
      />
      <GamesGrid />
    </section>
  );
}
