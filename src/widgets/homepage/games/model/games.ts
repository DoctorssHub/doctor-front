import type { StaticImageData } from "next/image";

import gameDice from "@/assets/homePage/games/game_dice.webp";
import gameKeno from "@/assets/homePage/games/game_keno.webp";
import gamePlinko from "@/assets/homePage/games/game_plinko.webp";
import gameRoulette from "@/assets/homePage/games/game_roulette.webp";

export type Game = {
  accent: string;
  blurColor: string;
  gradientEnd: string;
  gradientId: string;
  gradientStart: string;
  href: string;
  image: StaticImageData;
  title: string;
};

export const games: Game[] = [
  {
    accent: "var(--color-accent-purple)",
    blurColor: "rgba(126, 34, 206, 0.75)",
    gradientEnd: "rgba(147, 51, 234, 0.2)",
    gradientId: "game-mark-dice",
    gradientStart: "#7e22ce",
    href: "/all-games/dice",
    image: gameDice,
    title: "Dice",
  },
  {
    accent: "var(--color-accent-red)",
    blurColor: "rgba(144, 6, 22, 0.75)",
    gradientEnd: "rgba(220, 38, 38, 0.2)",
    gradientId: "game-mark-roulette",
    gradientStart: "#dc2626",
    href: "/all-games/roulette",
    image: gameRoulette,
    title: "Roulette",
  },
  {
    accent: "var(--color-accent-yellow)",
    blurColor: "rgba(250, 204, 21, 0.75)",
    gradientEnd: "rgba(250, 204, 21, 0.1)",
    gradientId: "game-mark-keno",
    gradientStart: "#facc15",
    href: "#",
    image: gameKeno,
    title: "Keno",
  },
  {
    accent: "var(--color-brand)",
    blurColor: "rgba(34, 197, 94, 0.75)",
    gradientEnd: "rgba(20, 83, 45, 0.5)",
    gradientId: "game-mark-plinko",
    gradientStart: "#22c55e",
    href: "/all-games/plinko",
    image: gamePlinko,
    title: "Plinko",
  },
];
