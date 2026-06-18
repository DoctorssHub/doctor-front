import type { BetHistoryItem, GameType } from "@/entities/bet/model/types";

export type BetHistoryVariant = "profile" | "games-live" | "game-live";

export type BetHistoryLiveCategory = "all" | "high-rollers" | "lucky-bets";

export type BetHistorySort = "date" | "win";

export type BetHistoryQueryParams =
  | {
      variant: "profile";
      game?: GameType;
      page: number;
      take: number;
      search: string;
      sort: BetHistorySort;
      userId?: string;
    }
  | {
      variant: "games-live";
      category: BetHistoryLiveCategory;
      limit: number;
      page: number;
    }
  | {
      variant: "game-live";
      category: BetHistoryLiveCategory;
      game: GameType;
      limit: number;
      page: number;
    };

export type BetHistoryResponse = {
  items: BetHistoryItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};
