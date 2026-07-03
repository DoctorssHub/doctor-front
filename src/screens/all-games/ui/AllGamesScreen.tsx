import { BetHistoryTable } from "@/widgets/bet-history";
import {
  FaqSection,
  homepageFaqItems,
  homepageFaqTitle,
  homepageFaqToggleLabels,
} from "@/widgets/faq";
import { GamesGrid } from "@/widgets/homepage";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";

import { AllGamesIntro } from "./AllGamesIntro";

export function AllGamesScreen() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-(--color-page) text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 z-0 h-[260px] w-[130%] max-w-[1300px] -translate-x-1/2 opacity-80 blur-2xl max-[767px]:h-[210px] max-[767px]:w-[160%]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(239, 68, 68, 0.28) 0%, rgba(239, 68, 68, 0.1) 38%, transparent 72%)",
        }}
      />
      <div className="games-page-entrance relative z-10 mx-auto flex w-full max-w-[900px] flex-col gap-8 px-4 py-12 tablet:max-laptop:max-w-[720px] max-[1023px]:py-8">
        <section
          aria-labelledby="all-games-title"
          className="flex flex-col gap-6"
        >
          <div className="games-page-copy-entrance">
            <AllGamesIntro />
          </div>
          <div className="games-grid-entrance">
            <GamesGrid
              animateCards
              variant="all-games"
            />
          </div>
        </section>
        <ScrollReveal delayMs={80}>
          <div className="games-table-entrance">
            <BetHistoryTable variant="games-live" />
          </div>
        </ScrollReveal>
        <ScrollReveal delayMs={120}>
          <div className="games-faq-entrance">
            <FaqSection
              defaultOpenIndex={1}
              items={homepageFaqItems}
              title={homepageFaqTitle}
              toggleLabels={homepageFaqToggleLabels}
            />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
