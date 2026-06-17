import type { StaticImageData } from "next/image";
import chip1 from "@/assets/games/roulette/Coint_1.webp";
import chip5 from "@/assets/games/roulette/Coint_2.webp";
import chip25 from "@/assets/games/roulette/Coint_3.webp";
import chip50 from "@/assets/games/roulette/Coint_4.webp";
import chip250 from "@/assets/games/roulette/Coint_5.webp";
import chip25k from "@/assets/games/roulette/Coint_6.webp";
import chip500 from "@/assets/games/roulette/Coint_7.webp";
import chip2k from "@/assets/games/roulette/Coint_8.webp";
import chip5k from "@/assets/games/roulette/Coint_9.webp";
import chip50k from "@/assets/games/roulette/Coint_10.webp";

export const DEFAULT_CHIP_IMAGE = chip1;

export const CHIP_IMAGES = new Map<number, StaticImageData>([
  [1, chip1],
  [5, chip5],
  [25, chip25],
  [50, chip50],
  [250, chip250],
  [500, chip500],
  [2000, chip2k],
  [5000, chip5k],
  [25000, chip25k],
  [50000, chip50k],
]);

export const CHIP_DENOMINATIONS = Array.from(CHIP_IMAGES.keys()).sort(
  (a, b) => a - b,
);

export function formatChipLabel(value: number) {
  return value >= 1000 ? `${value / 1000}K` : String(value);
}
