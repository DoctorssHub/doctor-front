import Image from "next/image";

import featureGames from "@/assets/homepage/feature-games.png";
import featureLeaderboard from "@/assets/homepage/feature-leaderboard.png";
import featureRewards from "@/assets/homepage/feature-rewards.png";
import { SectionTitle } from "@/shared/ui/section-title";

const features = [
  { image: featureLeaderboard, title: "Leaderboard" },
  { image: featureRewards, title: "Rewards" },
  { image: featureGames, title: "Games" },
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle title="Features" />
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article className="group relative h-44 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft)" key={feature.title}>
            <Image alt="" className="object-cover transition duration-300 group-hover:scale-105" fill src={feature.image} />
            <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-card-overlay)" }} />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <h3 className="font-black text-white">{feature.title}</h3>
              <span className="grid size-7 place-items-center rounded bg-(--color-surface-nav-hover) text-(--color-text-muted)">{">"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
