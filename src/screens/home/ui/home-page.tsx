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
    <main className="min-h-screen bg-(--color-page) text-white max-[1279px]:overflow-x-hidden">
      <HomeShell>
        <HeroSection />
        <div className="mx-auto flex w-full max-w-[1150px] flex-col gap-8 pb-12 min-[1024px]:max-[1279px]:max-w-[960px] min-[768px]:max-[1023px]:max-w-[720px] max-[767px]:max-w-none max-[767px]:px-4">
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
