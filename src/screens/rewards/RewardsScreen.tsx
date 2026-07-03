import { RewardsPageView } from "@/features/rewards";
import {
  FaqSection,
  rewardsFaqItems,
  rewardsFaqTitle,
  rewardsFaqToggleLabels,
} from "@/widgets/faq";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";

export function RewardsScreen() {
  return (
    <main className="min-h-screen bg-(--color-page) text-(--color-text-primary)">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-9 max-tablet:px-4 max-tablet:py-7">
        <RewardsPageView />
        <ScrollReveal delayMs={120}>
          <div className="rewards-faq-entrance">
            <FaqSection
              items={rewardsFaqItems}
              title={rewardsFaqTitle}
              toggleLabels={rewardsFaqToggleLabels}
            />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
