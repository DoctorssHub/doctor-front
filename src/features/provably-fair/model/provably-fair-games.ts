import diceIcon from "@/assets/aside/dice.svg";
import kenoIcon from "@/assets/aside/keno.svg";
import plinkoIcon from "@/assets/aside/plinko.svg";
import rouletteIcon from "@/assets/aside/roulette.svg";
import type { StaticImageData } from "next/image";

export type ProvablyFairGame = "roulette" | "dice" | "keno" | "plinko";

export type ProvablyFairGameOption = {
  id: ProvablyFairGame;
  label: string;
  icon: StaticImageData;
};

export const PROVABLY_FAIR_GAMES: ProvablyFairGameOption[] = [
  { id: "roulette", label: "Roulette", icon: rouletteIcon },
  { id: "dice", label: "Dice", icon: diceIcon },
  { id: "keno", label: "Keno", icon: kenoIcon },
  { id: "plinko", label: "Plinko", icon: plinkoIcon },
];

export function getProvablyFairGameOption(game: ProvablyFairGame) {
  return PROVABLY_FAIR_GAMES.find((option) => option.id === game)
    ?? PROVABLY_FAIR_GAMES[0];
}
