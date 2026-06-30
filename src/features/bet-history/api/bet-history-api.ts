import {
  authenticatedClient,
  requestWithAuthRetry,
} from "@/shared/api";
import type {
  BetHistoryQueryParams,
  BetHistoryResponse,
  BetHistoryLiveCategory,
} from "../model/types";
import type { BetHistoryItem } from "@/entities/bet/model/types";

type BetHistoryRequest = {
  url: string;
  params: Record<string, string | number | undefined>;
};

// `/bets/latest*` returns a plain array of these items, and the `NewLiveBet`
// socket event delivers a single item in the same shape.
export type RawLiveBetItem = {
  betId: string;
  betSettledAt: string;
  betSize: string;
  gameImage: string | null;
  gameName: string;
  gameSlug: string;
  multiplier: string;
  payout: string;
  profileImgUrl: string;
  userId: string;
  username: string;
};

// `/bets/my` returns a paginated envelope with these (own) items.
type RawProfileBetItem = {
  id: string;
  betSize: string;
  gameName: string;
  payout: string;
  providerName: string;
  settledAt: string;
};

type RawProfileBetResponse = {
  data: RawProfileBetItem[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};

const BET_HISTORY_LIVE_PATHS: Record<BetHistoryLiveCategory, string> = {
  all: "/bets/latest",
  "high-rollers": "/bets/latest/high-rollers",
  "lucky-bets": "/bets/latest/lucky",
};

export async function getBetHistory(
  params: BetHistoryQueryParams,
): Promise<BetHistoryResponse> {
  const { url, params: requestParams } = createBetHistoryRequest(params);

  if (params.variant === "profile") {
    const response = await requestWithAuthRetry(() =>
      authenticatedClient.get<RawProfileBetResponse>(url, { params: requestParams }),
    );

    return mapProfileBetHistoryResponse(response.data);
  }

  const response = await requestWithAuthRetry(() =>
    authenticatedClient.get<RawLiveBetItem[]>(url, { params: requestParams }),
  );

  return mapLiveBetHistoryResponse(response.data);
}

function mapProfileBetHistoryResponse(
  data: RawProfileBetResponse,
): BetHistoryResponse {
  return {
    items: data.data.map(mapProfileBetItem),
    page: data.page,
    pageSize: data.take,
    totalPages: data.totalPages,
    totalItems: data.total,
  };
}

function mapLiveBetHistoryResponse(
  data: RawLiveBetItem[],
): BetHistoryResponse {
  return {
    items: data.map(mapLiveBetItem),
    page: 1,
    pageSize: data.length,
    totalPages: 1,
    totalItems: data.length,
  };
}

function mapProfileBetItem(item: RawProfileBetItem): BetHistoryItem {
  return {
    id: item.id,
    // `/bets/my` has no user fields — the table fills in the logged-in user.
    user: {
      id: item.id,
      name: "",
    },
    game: item.gameName,
    betAmount: item.betSize,
    multiplier: computeMultiplier(item.payout, item.betSize),
    prize: item.payout,
    createdAt: item.settledAt,
  };
}

export function mapLiveBetItem(item: RawLiveBetItem): BetHistoryItem {
  return {
    id: item.betId,
    user: {
      id: item.userId,
      name: item.username,
      avatarUrl: item.profileImgUrl ?? undefined,
    },
    game: item.gameName,
    betAmount: item.betSize,
    multiplier: Number(item.multiplier),
    prize: item.payout,
    createdAt: item.betSettledAt,
  };
}

function computeMultiplier(payout: string, betSize: string): number {
  const stake = Number(betSize);
  const prize = Number(payout);

  if (!Number.isFinite(stake) || stake === 0 || !Number.isFinite(prize)) {
    return 0;
  }

  return prize / stake;
}

function createBetHistoryRequest(
  params: BetHistoryQueryParams,
): BetHistoryRequest {
  switch (params.variant) {
    case "profile":
      return {
        url: "/bets/my",
        params: {
          page: params.page,
          take: params.take,
          gameSlug: params.gameSlug,
        },
      };
    case "games-live":
      return {
        url: BET_HISTORY_LIVE_PATHS[params.category],
        params: {
          limit: params.limit,
          page: params.page,
        },
      };
    case "game-live":
      return {
        url: BET_HISTORY_LIVE_PATHS[params.category],
        params: {
          game: params.game,
          limit: params.limit,
          page: params.page,
        },
      };
  }
}
