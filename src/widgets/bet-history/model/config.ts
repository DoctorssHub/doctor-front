import type { GameType } from "@/entities/bet/model/types";
import type {
  BetHistoryLiveCategory,
  BetHistorySort,
} from "@/features/bet-history/model/types";

export type SortOption = {
  label: string;
  value: BetHistorySort;
};

export const BET_HISTORY_SORT_OPTIONS: SortOption[] = [
  { label: "Date", value: "date" },
  { label: "Win", value: "win" },
];

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

export const BET_HISTORY_DEFAULT_LIMIT = 8;

// Profile history is fetched in full and paginated on the client.
export const BET_HISTORY_PROFILE_PAGE_SIZE = 10;
