import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import CoinsLeft from "@/assets/homePage/leaderboardSection/coins_left.webp";
import CoinsRight from "@/assets/homePage/leaderboardSection/coins_right.webp";
import Rocket from "@/assets/homePage/leaderboardSection/rocket.webp";
import CardIcon from "@/assets/homePage/leaderboardSection/cardIcon.svg";
import { players } from "../model/players";
import { LeaderboardCard } from "./leaderboard-card";
import { LeaderboardGlow } from "./leaderboard-glow";

const mobileCardOrder = [
  "max-tablet:order-2",
  "max-tablet:order-1",
  "max-tablet:order-3",
];

const cardEntranceClasses = [
  "leaderboard-card-entrance leaderboard-card-entrance-left",
  "leaderboard-card-entrance leaderboard-card-entrance-center",
  "leaderboard-card-entrance leaderboard-card-entrance-right",
];

type LeaderboardSectionProps = {
  animateOnMount?: boolean;
  contentClassName?: string;
  footer?: ReactNode;
  subtitle?: ReactNode;
  title: string;
  titleClassName?: string;
  viewAllHref?: string | null;
};

export function LeaderboardSection({
  animateOnMount = false,
  contentClassName = "",
  footer,
  subtitle = (
    <>
      Players who wager using code <span className="uppercase">THEDOCTOR</span>{" "}
      on DegenCity are automatically entered
    </>
  ),
  title,
  titleClassName = "text-[40px] font-black max-tablet:text-[36px]",
  viewAllHref = "/leaderboard",
}: LeaderboardSectionProps) {
  return (
    <section className={`relative py-10 text-center max-large:ml-[calc(50%-50dvw)] max-large:w-[100dvw] max-large:max-w-[100dvw] max-large:overflow-hidden ${animateOnMount ? "leaderboard-section-entrance" : ""}`}>
      <LeaderboardGlow />
      <div
        className={`relative z-10 max-large:mx-auto max-large:max-w-[960px] tablet:max-laptop:max-w-[720px] max-tablet:px-4 ${contentClassName}`}
      >
        <h2
          className={`leaderboard-copy-entrance whitespace-pre-line uppercase text-center text-[#fdfdfd] ${titleClassName}`}
        >
          {title}
        </h2>
        <p className="leaderboard-copy-entrance leaderboard-copy-entrance-subtitle mt-2 text-[18px] text-(--color-text-muted) max-tablet:text-[14px]">
          {subtitle}
        </p>
        <div className="relative mt-24 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end max-tablet:mt-4 max-tablet:gap-3">
          <Image
            alt="Leaderboard coins"
            className="leaderboard-decoration-entrance leaderboard-decoration-left absolute left-0 bottom-0 h-[233px] w-[233px] max-w-none object-contain"
            src={CoinsLeft}
            width={233}
            height={233}
          />
          <Image
            alt="Leaderboard coins"
            className="leaderboard-decoration-entrance leaderboard-decoration-right absolute bottom-0 z-15 right-17 h-[145px] w-[145px] max-w-none object-contain"
            src={CoinsRight}
            width={145}
            height={145}
          />
          <Image
            alt="Leaderboard rocket"
            className="leaderboard-decoration-entrance leaderboard-decoration-rocket absolute bottom-5 z-10 right-0 h-[283px] w-[233px] max-w-none object-contain"
            src={Rocket}
            width={233}
            height={233}
          />
          <Image
            alt="Leaderboard card decoration"
            className="leaderboard-card-symbol-entrance absolute bottom-5 -right-40 max-w-none object-contain rotate-0 opacity-30 [--leaderboard-symbol-opacity:0.3] [--leaderboard-symbol-rotation:0deg]"
            src={CardIcon}
            width={300}
            height={233}
          />
          <Image
            alt="Leaderboard card decoration"
            className="leaderboard-card-symbol-entrance leaderboard-card-symbol-delay absolute -top-20 right-80 max-w-none object-contain -rotate-10 opacity-50 [--leaderboard-symbol-opacity:0.5] [--leaderboard-symbol-rotation:-10deg]"
            src={CardIcon}
            width={133}
            height={233}
          />
          <Image
            alt="Leaderboard card decoration"
            className="leaderboard-card-symbol-entrance absolute bottom-5 -left-20 max-w-none object-contain -rotate-45 opacity-50 [--leaderboard-symbol-opacity:0.5] [--leaderboard-symbol-rotation:-45deg]"
            src={CardIcon}
            width={233}
            height={233}
          />
          <Image
            alt="Leaderboard card decoration"
            className="leaderboard-card-symbol-entrance leaderboard-card-symbol-delay absolute -top-50 left-50 max-w-none object-contain -rotate-45 opacity-40 [--leaderboard-symbol-opacity:0.4] [--leaderboard-symbol-rotation:-45deg]"
            src={CardIcon}
            width={133}
            height={233}
          />
          {players.map((player, index) => (
            <LeaderboardCard
              className={`${cardEntranceClasses[index]} ${mobileCardOrder[index]}`}
              key={`${player.score}-${index}`}
              player={player}
            />
          ))}
        </div>
        {footer ? (
          <div className="leaderboard-footer-entrance">{footer}</div>
        ) : null}
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="leaderboard-footer-entrance mt-4 inline-block w-50 rounded-lg border border-(--color-border-strong) px-6 py-3 text-[20px] font-semibold text-(--color-text-primary) transition hover:bg-(--color-border-strong) max-tablet:w-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
            }}
          >
            View All
          </Link>
        ) : null}
      </div>
    </section>
  );
}
