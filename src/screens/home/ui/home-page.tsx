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
    <main className="min-h-screen bg-(--color-page) text-white">
      <HomeHeader />
      <div className="lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <HeroSection />
          <div className="mx-auto flex w-full max-w-302.5 flex-col gap-7 px-4 pb-12 sm:px-6 lg:px-8">
            <RewardsBanner />
            <FeaturesSection />
            <OnboardingSection />
            <GamesSection />
            <LeaderboardSection />
            <FaqSection />
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
