import Image from "next/image";
import Link from "next/link";

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

export function LeaderboardSection() {
  return (
    <section className="relative py-10 text-center max-large:ml-[calc(50%-50dvw)] max-large:w-[100dvw] max-large:max-w-[100dvw] max-large:overflow-hidden">
      <LeaderboardGlow />
      <div className="relative z-10 max-large:mx-auto max-large:max-w-[960px] tablet:max-laptop:max-w-[720px] max-tablet:px-4">
        <h2 className="text-[40px] font-black uppercase text-(--color-text-primary) max-tablet:text-[36px]">
          Monthly Leaderboard
        </h2>
        <p className="mt-2 text-[18px] text-(--color-text-muted) max-tablet:text-[14px]">
          Players who wager using code{" "}
          <span className="uppercase">THEDOCTOR</span> on DegenCity are
          automatically entered
        </p>
        <div className="relative mt-24 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end max-tablet:mt-4 max-tablet:gap-3">
          <Image
            alt=""
            className="absolute left-0 bottom-0 h-[233px] w-[233px] max-w-none object-contain"
            src={CoinsLeft}
            width={233}
            height={233}
          />
          <Image
            alt=""
            className="absolute bottom-0 z-15 right-17 h-[145px] w-[145px] max-w-none  object-contain"
            src={CoinsRight}
            width={145}
            height={145}
          />
          <Image
            alt=""
            className="absolute bottom-5 z-10 right-0 h-[283px] w-[233px] max-w-none object-contain"
            src={Rocket}
            width={233}
            height={233}
          />
          <Image
            alt=""
            className="absolute bottom-5 -right-40  max-w-none object-contain rotate-0 opacity-30"
            src={CardIcon}
            width={300}
            height={233}
          />
          <Image
            alt=""
            className="absolute -top-20 right-80  max-w-none object-contain -rotate-10 opacity-50"
            src={CardIcon}
            width={133}
            height={233}
          />
          <Image
            alt=""
            className="absolute bottom-5 -left-20  max-w-none object-contain -rotate-45 opacity-50"
            src={CardIcon}
            width={233}
            height={233}
          />
          <Image
            alt=""
            className="absolute -top-50 left-50  max-w-none object-contain -rotate-45 opacity-40"
            src={CardIcon}
            width={133}
            height={233}
          />
          {players.map((player, index) => (
            <LeaderboardCard
              className={mobileCardOrder[index]}
              key={`${player.score}-${index}`}
              player={player}
            />
          ))}
        </div>
        <Link
          href="/"
          className="mt-4 inline-block w-50 rounded-lg border border-(--color-border-strong) px-6 py-3 text-[20px] font-semibold text-(--color-text-primary) transition hover:bg-(--color-border-strong) max-tablet:w-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
          }}
        >
          View All
        </Link>
      </div>
    </section>
  );
}
