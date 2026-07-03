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
  ScrollReveal,
} from "@/widgets/homepage";
import { LeaderboardSection } from "@/widgets/leaderboard";

const sectionRevealDelays = [0, 40, 70, 90, 70, 90, 70];

export function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-(--color-page) text-white">
      <HeroSection />
      <div className="mx-auto flex w-full max-w-[1150px] flex-col gap-8 pb-12 laptop:max-large:max-w-[960px] tablet:max-laptop:max-w-[720px] max-tablet:max-w-none max-tablet:px-4">
        <ScrollReveal delayMs={sectionRevealDelays[0]}>
          <PromotionsSection />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[1]}>
          <RewardsBanner />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[2]}>
          <FeaturesSection />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[3]}>
          <OnboardingSection />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[4]}>
          <GamesSection />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[5]}>
          <LeaderboardSection title="Monthly Leaderboard" />
        </ScrollReveal>
        <ScrollReveal delayMs={sectionRevealDelays[6]}>
          <FaqSection
            defaultOpenIndex={1}
            items={homepageFaqItems}
            title={homepageFaqTitle}
            toggleLabels={homepageFaqToggleLabels}
          />
        </ScrollReveal>
      </div>
    </main>
  );
}
