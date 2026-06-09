import {
  FaqSection,
  FeaturesSection,
  GamesSection,
  HeroSection,
  LeaderboardSection,
  OnboardingSection,
  PromotionsSection,
  RewardsBanner,
} from "@/widgets/homepage";
import { Footer } from "@/widgets/layout";
import { HomeShell } from "./home-shell";

export function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-(--color-page) text-white">
      <HomeShell>
        <HeroSection />
        <div className="mx-auto flex w-full max-w-[1150px] flex-col gap-8 pb-12 laptop:max-large:max-w-[960px] tablet:max-laptop:max-w-[720px] max-tablet:max-w-none max-tablet:px-4">
          <PromotionsSection />
          <RewardsBanner />
          <FeaturesSection />
          <OnboardingSection />
          <GamesSection />
          <LeaderboardSection />
          <FaqSection />
        </div>
        <Footer />
      </HomeShell>
    </main>
  );
}
