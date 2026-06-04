import Image from "next/image";

import avatarOne from "@/assets/homepage/avatar-one.png";
import avatarThree from "@/assets/homepage/avatar-three.png";
import avatarTwo from "@/assets/homepage/avatar-two.png";
import trophyBronze from "@/assets/homepage/trophy-bronze.svg";
import trophyGold from "@/assets/homepage/trophy-gold.svg";
import { Button } from "@/shared/ui/button";

const players = [
  { avatar: avatarOne, prize: "1,500.00", score: "1,234,567", trophy: trophyBronze },
  { avatar: avatarTwo, prize: "1,500.00", score: "1,234,567", trophy: trophyGold, winner: true },
  { avatar: avatarThree, prize: "1,500.00", score: "1,234,567", trophy: trophyBronze },
];

export function LeaderboardSection() {
  return (
    <section className="relative py-10 text-center">
      <LeaderboardGlow />
      <div className="relative z-10">
        <h2 className="text-3xl font-black uppercase text-white sm:text-4xl">Monthly Leaderboard</h2>
        <p className="mt-3 text-sm text-(--color-text-muted)">
          Players who wager using code <span className="font-bold text-white">THEDOCTOR</span> on DegenCity are automatically entered
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row md:items-end">
          {players.map((player, index) => (
            <article
              className={`relative w-44 rounded-xl border border-(--color-border-leaderboard) bg-(--color-surface-card) p-4 shadow-(--shadow-inset-soft) ${
                player.winner ? "md:-translate-y-8" : ""
              }`}
              key={`${player.score}-${index}`}
            >
              <Image alt="" className="mx-auto rounded-full border-2 border-(--color-brand) object-cover" height={80} src={player.avatar} width={80} />
              <Image alt="" className="absolute left-1/2 top-[72px] -translate-x-1/2" height={32} src={player.trophy} width={32} />
              <h3 className="mt-5 font-black">Username</h3>
              <p className="text-xs text-(--color-text-muted)">wagered</p>
              <p className="mt-1 text-sm font-bold text-white">{player.score}</p>
              <div className="mt-3 rounded-lg bg-(--color-surface-prize) px-3 py-2 font-black">$ {player.prize}</div>
            </article>
          ))}
        </div>
        <Button className="mt-3" variant="ghost">
          View all
        </Button>
      </div>
    </section>
  );
}

function LeaderboardGlow() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-120px] z-0 h-[800px] w-[1213px] max-w-none -translate-x-1/2 overflow-visible"
      fill="none"
      viewBox="0 0 1213 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#leaderboard-glow-blur)">
        <path
          d="M-353 679.153L532.729 120H718.5L1660 679.153H-353Z"
          fill="url(#leaderboard-glow-gradient)"
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="799.153"
          id="leaderboard-glow-blur"
          width="2253"
          x="-473"
          y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feGaussianBlur
            result="effect1_foregroundBlur_10050_976"
            stdDeviation="60"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="leaderboard-glow-gradient"
          x1="668.349"
          x2="666.297"
          y1="143.788"
          y2="636.959"
        >
          <stop stopColor="#00FFAA" stopOpacity="0.5" />
          <stop offset="0.34" stopColor="#24A6C7" />
          <stop offset="1" stopColor="#6A00FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
