import Image, { type StaticImageData } from "next/image";

import blockCompetition from "@/assets/homePage/promotions/blockCompetition.webp";
import blockFortune from "@/assets/homePage/promotions/blockFortune.webp";
import clockFortune from "@/assets/homePage/promotions/clock_fortune.svg";
import clockCompetition from "@/assets/homePage/promotions/clock_competition.svg";

import { PromotionCopyButton } from "./promotion-copy-button";

type PromotionCard = {
  accent: "purple" | "red";
  background: StaticImageData;
  code?: string;
  eyebrow: string;
  timer: string;
  title: string;
};

const promotions: PromotionCard[] = [
  {
    accent: "purple",
    background: blockFortune,
    code: "THEDOCTOR",
    eyebrow: "Get 5%",
    timer: "2d : 15h : 35m",
    title: "FORTUNE BONUS",
  },
  {
    accent: "red",
    background: blockCompetition,
    eyebrow: "Monthly",
    timer: "2d : 15h : 35m",
    title: "COMPETITION",
  },
];

function PromotionTimer({
  accent,
  timer,
}: Pick<PromotionCard, "accent" | "timer">) {
  return (
    <div className="inline-flex h-[30px] items-center gap-2 rounded-md bg-[#2B303B]/50 px-3 text-[12px] font-medium text-(--color-text-muted) max-tablet:text-[14px]">
      <Image
        alt=""
        src={accent === "purple" ? clockFortune : clockCompetition}
        width={16}
        height={16}
      />

      {timer}
    </div>
  );
}

function PromotionCardView({ promotion }: { promotion: PromotionCard }) {
  return (
    <article
      className="relative mt-8 flex h-[220px] flex-col justify-between overflow-hidden rounded-xl bg-cover bg-center p-4 text-left sm:p-5 max-laptop:h-[212px]"
      style={{ backgroundImage: `url(${promotion.background.src})` }}
    >
      <div className="flex min-h-[132px] flex-col items-start">
        <p className="text-[18px] leading-none font-normal text-(--color-text-muted) max-tablet:text-[16px]">
          {promotion.eyebrow}
        </p>
        <h2 className="mt-1 text-[36px] font-black text-(--color-text-primary) max-tablet:text-[24px]">
          {promotion.title}
        </h2>
        {promotion.code ? (
          <p className="mt-1 flex items-center gap-1 text-[16px] leading-none font-medium text-(--color-text-primary) max-tablet:text-[14px]">
            Use code:
            <span className="text-[#8d3cff]">{promotion.code}</span>
            <PromotionCopyButton value={promotion.code} />
          </p>
        ) : null}
      </div>
      <div className="mt-auto">
        <PromotionTimer
          accent={promotion.accent}
          timer={promotion.timer}
        />
      </div>
    </article>
  );
}

export function PromotionsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {promotions.map((promotion) => (
        <PromotionCardView
          key={promotion.title}
          promotion={promotion}
        />
      ))}
    </section>
  );
}
