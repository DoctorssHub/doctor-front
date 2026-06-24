import { Button } from "@/shared";
import { FaqSection } from "@/widgets/faq";
import { LeaderboardSection, LeaderboardTable } from "@/widgets";

import {
  leaderboardFaqItems,
  leaderboardFaqToggleLabels,
} from "./model/leaderboard-faq";
import { LeaderboardCountdown } from "./ui/leaderboard-countdown";
import { LeaderboardEligibilityNotice } from "./ui/leaderboard-eligibility-notice";

const LeaderboardScreen = () => {
  return (
    <main className="mx-auto min-h-screen overflow-hidden bg-(--color-page) text-white">
      <LeaderboardSection
        contentClassName="mx-auto max-w-[1150px]"
        footer={<LeaderboardCountdown />}
        subtitle="Be a Top 1000 player in January and win a live Bonus Buy with TheDoctor"
        title={"THE DOCTOR'S END OF\nMONTH BONUS BUY COMPETITION!"}
        titleClassName="text-[36px] font-black max-[768px]:text-[30px]"
        viewAllHref={null}
      />
      <div className="mx-auto flex flex-col items-center max-w-[890px] px-4">
        <LeaderboardEligibilityNotice />
        <Button
          className="mx-auto mt-7 block"
          variant="primary"
        >
          Join the leaderboard
        </Button>
        <LeaderboardTable />
        <div className="mt-11 pb-12">
          <FaqSection
            items={leaderboardFaqItems}
            title="Competition Rules & Eligibility"
            toggleLabels={leaderboardFaqToggleLabels}
          />
        </div>
      </div>
    </main>
  );
};

export default LeaderboardScreen;
