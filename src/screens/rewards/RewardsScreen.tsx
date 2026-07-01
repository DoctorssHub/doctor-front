import { RewardsPageView } from "@/features/rewards";
import {
  FaqSection,
  rewardsFaqItems,
  rewardsFaqTitle,
  rewardsFaqToggleLabels,
} from "@/widgets/faq";

export function RewardsScreen() {
  return (
    <main className="min-h-screen bg-(--color-page) text-(--color-text-primary)">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-9 max-tablet:px-4 max-tablet:py-7">
        <RewardsPageView />
        <FaqSection
          items={rewardsFaqItems}
          title={rewardsFaqTitle}
          toggleLabels={rewardsFaqToggleLabels}
        />
      </div>
    </main>
  );
}
