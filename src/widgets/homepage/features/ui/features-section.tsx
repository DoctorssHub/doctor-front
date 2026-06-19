import Image from "next/image";

import featuresBackgroundOne from "@/assets/homePage/features/featuresBg_1.webp";
import featuresBackgroundTwo from "@/assets/homePage/features/featuresBg_2.webp";
import featuresBackgroundThree from "@/assets/homePage/features/featuresBg_3.webp";
import featureGames from "@/assets/homePage/features/feature-games.png";
import featureLeaderboard from "@/assets/homePage/features/feature-leaderboard.png";
import featureRewards from "@/assets/homePage/features/feature-rewards.png";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";
import FeaturesIcon from "@/assets/homePage/features/featuresIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";
import Link from "next/link";

const features = [
  {
    background: featuresBackgroundOne,
    image: featureLeaderboard,
    title: "Leaderboard",
    href: "#",
  },
  {
    background: featuresBackgroundTwo,
    image: featureRewards,
    title: "Rewards",
    href: "#1",
  },
  {
    background: featuresBackgroundThree,
    image: featureGames,
    title: "Games",
    href: "#2",
  },
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="Features"
        icon={FeaturesIcon}
      />
      <div className="flex items-center gap-4 laptop:max-large:grid laptop:max-large:grid-cols-3 tablet:max-laptop:grid tablet:max-laptop:grid-cols-2 max-tablet:grid max-tablet:grid-cols-1">
        {features.map((feature) => (
          <Link
            className="group relative h-[270px] w-[275px] overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft) transition duration-300 hover:-translate-y-1 hover:border-[#22c55e]/60 hover:shadow-[0_18px_50px_rgb(34_197_94/18%)] laptop:max-large:h-[303px] laptop:max-large:w-full tablet:max-laptop:h-[171px] tablet:max-laptop:w-full max-tablet:h-[171px] max-tablet:w-full"
            href={feature.href}
            key={feature.title}
          >
            <Image
              alt={`${feature.title} feature background`}
              className="z-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              width={275}
              height={270}
              src={feature.background}
            />
            <div
              className="absolute left-1/2 top-[60%] z-10 h-[270px] w-[275px] -translate-x-1/2 translate-y-[-40%] opacity-50 mix-blend-plus-lighter transition duration-500 group-hover:scale-125 group-hover:opacity-80"
              style={{
                background:
                  "radial-gradient(ellipse at 52% 76%, rgb(49 255 76 / 28%) 0%, rgb(49 255 76 / 50%) 34%, transparent 68%)",
                filter: "blur(54px)",
              }}
            />
            <div
              className="absolute inset-0 z-20 transition duration-300 group-hover:bg-[#22c55e]/10"
              style={{ backgroundImage: "var(--gradient-card-overlay)" }}
            />
            <div className="absolute inset-0 z-30 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-full" />
            <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between p-4">
              <h3 className="text-[24px] font-semibold text-(--color-text-primary) transition duration-300 group-hover:text-white">
                {feature.title}
              </h3>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] transition duration-300 group-hover:scale-110 group-hover:bg-[linear-gradient(180deg,#4bef82_0%,#22c55e_100%)] group-hover:shadow-[0_0_18px_rgb(34_197_94/45%)]">
                <Image
                  alt={`Open ${feature.title}`}
                  height={12}
                  src={ArrowIcon}
                  width={12}
                  className="rotate-180 transition duration-300 group-hover:brightness-0"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
