import {
  FaqSection,
  FeaturesSection,
  Footer,
  GamesSection,
  HeroSection,
  LeaderboardSection,
  OnboardingSection,
  RewardsBanner,
  Sidebar,
  HomeHeader,
} from "@/widgets/homepage";

export function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-page)] text-white">
      <HomeHeader />
      {/* <Sidebar /> */}
      <div className="lg:pl-[92px]">
        <HeroSection />
        <div className="mx-auto flex w-full max-w-[1210px] flex-col gap-7 px-4 pb-12 sm:px-6 lg:px-8">
          <RewardsBanner />
          <FeaturesSection />
          <OnboardingSection />
          <GamesSection />
          <LeaderboardSection />
          <FaqSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
