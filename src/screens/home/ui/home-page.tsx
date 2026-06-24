import {
  FaqSection,
  homepageFaqItems,
  homepageFaqTitle,
  homepageFaqToggleLabels,
} from "@/widgets/faq";
import {
  FeaturesSection,
  GamesSection,
  HeroSection,
  OnboardingSection,
  PromotionsSection,
  RewardsBanner,
} from "@/widgets/homepage";
import { LeaderboardSection } from "@/widgets/leaderboard";

export function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-(--color-page) text-white">
      <HeroSection />
      <div className="mx-auto flex w-full max-w-[1150px] flex-col gap-8 pb-12 laptop:max-large:max-w-[960px] tablet:max-laptop:max-w-[720px] max-tablet:max-w-none max-tablet:px-4">
        <PromotionsSection />
        <RewardsBanner />
        <FeaturesSection />
        <OnboardingSection />
        <GamesSection />
        <LeaderboardSection title="Monthly Leaderboard" />
        <FaqSection
          defaultOpenIndex={1}
          items={homepageFaqItems}
          title={homepageFaqTitle}
          toggleLabels={homepageFaqToggleLabels}
        />
      </div>
    </main>
  );
}
