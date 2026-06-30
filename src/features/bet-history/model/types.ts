import type { BetHistoryItem, GameType } from "@/entities/bet/model/types";

export type BetHistoryVariant = "profile" | "games-live" | "game-live";

export type BetHistoryLiveCategory = "all" | "high-rollers" | "lucky-bets";

export type BetHistoryQueryParams =
  | {
      variant: "profile";
      gameSlug?: string;
      page: number;
      take: number;
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
