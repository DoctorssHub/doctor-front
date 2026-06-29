import type { GameType } from "@/entities/bet/model/types";
import type { BetHistoryLiveCategory } from "@/features/bet-history/model/types";

export type GameTab = {
  label: string;
  value?: GameType;
};

export type LiveTab = {
  label: string;
  value: BetHistoryLiveCategory;
};

export const BET_HISTORY_GAME_TABS: GameTab[] = [
  { label: "All" },
  { label: "Roulette", value: "roulette" },
  { label: "Keno", value: "keno" },
  { label: "Plinko", value: "plinko" },
  { label: "Dice", value: "dice" },
];

export const BET_HISTORY_LIVE_TABS: LiveTab[] = [
  { label: "All Bets", value: "all" },
  { label: "High Rollers", value: "high-rollers" },
  { label: "Lucky Bets", value: "lucky-bets" },
];

export const GAME_SLUG_MAP: Record<GameType, string> = {
  roulette: "thedoctor_roulette",
  keno: "thedoctor_keno",
  plinko: "thedoctor_plinko",
  dice: "thedoctor_dice",
};

export const BET_HISTORY_DEFAULT_LIMIT = 8;

export const BET_HISTORY_PROFILE_PAGE_SIZE = 10;
