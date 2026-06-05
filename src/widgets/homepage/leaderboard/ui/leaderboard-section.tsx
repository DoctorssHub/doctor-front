import Image from "next/image";
import Link from "next/link";

import CoinsLeft from "@/assets/coins_left.webp";
import CoinsRight from "@/assets/coins_right.webp";
import Rocket from "@/assets/rocket.webp";
import CardIcon from "@/assets/cardIcon.svg"
import { players } from "../model/players";
import { LeaderboardCard } from "./leaderboard-card";
import { LeaderboardGlow } from "./leaderboard-glow";

export function LeaderboardSection() {
  return (
    <section className="relative py-10 text-center">
      <LeaderboardGlow />
      <div className="relative z-10">
        <h2 className="text-[40px] font-black uppercase text-(--color-text-primary)">
          Monthly Leaderboard
        </h2>
        <p className="mt-2 text-[18px] text-(--color-text-muted)">
          Players who wager using code{" "}
          <span className="uppercase">THEDOCTOR</span> on DegenCity are
          automatically entered
        </p>
        <div className="relative mt-24 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end">
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
            className="absolute bottom-5 -right-40  max-w-none object-contain rotate-0 opacity-50"
            src={CardIcon}
            width={333}
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
              key={`${player.score}-${index}`}
              player={player}
            />
          ))}
        </div>
        <Link
          href="/"
          className="mt-4 inline-block w-50 rounded-lg border border-(--color-border-strong) px-6 py-3 text-[20px] font-semibold text-(--color-text-primary) transition hover:bg-(--color-border-strong)"
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
