import { Button } from "@/shared";
import { FaqSection } from "@/widgets/faq";
import { LeaderboardSection, LeaderboardTable } from "@/widgets";

const leaderboardFaqItems = [
  {
    answer:
      "Players are ranked by their total wagered amount on DegenCity under code THEDOCTOR during the current month. The leaderboard resets at the end of each month (UTC), and the top players win prizes, including a live Bonus Buy with TheDoctor.",
    question: "How does the Leaderboard work?",
  },
  {
    answer:
      "Only registered players wagering with code THEDOCTOR are ranked. Make sure your DegenCity and Discord accounts are connected on your thedoctor.net profile.",
    question: "Who is eligible?",
  },
  {
    answer:
      "Only qualifying wagers placed during the active period count toward leaderboard placement. Voided, refunded, or suspicious activity may be excluded from final results.",
    question: "Which wagers count?",
  },
  {
    answer:
      "Results are finalized after the monthly period ends and the countdown reaches zero. Past winners are listed on the Bonus by Monthly Winners page, and announcements are posted in Discord.",
    question: "When are winners announced?",
  },
  {
    answer:
      "Prize details are shown on the leaderboard page or announced through official TheDoctor channels. Winners may need to complete verification or follow claim instructions before prizes are sent.",
    question: "How are prizes paid out?",
  },
  {
    answer:
      "First, wait for the next leaderboard update because data may not be real-time. If the issue remains, contact TheDoctor support or the official Discord with your username and relevant campaign details so the team can review it.",
    question: "What should I do if my leaderboard position looks wrong?",
  },
];

const leaderboardFaqToggleLabels = {
  collapseAnswer: "Collapse answer",
  expandAnswer: "Expand answer",
};

const countdownItems = [
  { label: "D", value: "00" },
  { label: "H", value: "13" },
  { label: "M", value: "49" },
  { label: "S", value: "12" },
];

function LeaderboardCountdown() {
  return (
    <div
      className="mx-auto mt-4 flex h-[138px] w-[288px] flex-col items-center rounded-[18px] p-6 max-[374px]:w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
      }}
    >
      <p className="text-[16px] font-semibold leading-[125%] text-[#fdfdfd]">
        Competition ends in:
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {countdownItems.map((item) => (
          <div
            className="flex h-[54px] w-[51px] flex-col items-center justify-center rounded-lg bg-[#0e0f13] px-4 py-2"
            key={item.label}
          >
            <span className="text-[14px] font-semibold leading-[129%] text-[#fdfdfd]">
              {item.value}
            </span>
            <span className="text-[12px] font-semibold leading-[133%] text-[#566374]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardEligibilityNotice() {
  return (
    <p className="mx-auto mt-7 flex h-11 w-full  items-center justify-center rounded-lg bg-[rgba(82,91,113,0.13)] px-3 text-center text-[12px] font-medium leading-[133%] text-[#566374] max-[767px]:h-auto max-[767px]:min-h-11">
      Only registered and Super Confirmed players wagering with code{" "}
      <span className="font-semibold text-[#fdfdfd]">THEDOCTOR</span> are ranked
    </p>
  );
}

const LeaderboardScreen = () => {
  return (
    <main className="min-h-screen  mx-auto bg-(--color-page) text-white">
      <LeaderboardSection
        contentClassName="mx-auto max-w-[1150px] "
        footer={
          <>
            <LeaderboardCountdown />
          </>
        }
        subtitle="Be a Top 1000 player in January and win a live Bonus Buy with TheDoctor"
        title={"THE DOCTOR'S END OF\nMONTH BONUS BUY COMPETITION!"}
        titleClassName="text-[30px] font-black"
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
