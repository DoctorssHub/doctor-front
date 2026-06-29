import { authenticatedClient } from "@/shared/api";

import type {
  LeaderboardDetailsResponse,
  LeaderboardMonthResponse,
} from "../model/types";

type RawLeaderboardMonth = {
  month: string;
  title: string;
  updatedAt: string;
};

type RawLeaderboardMonthResponse = {
  data: RawLeaderboardMonth[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};

type RawLeaderboardParticipant = {
  createdAt: string;
  month: string;
  position: number;
  prizeType: string;
  prizeValue: string;
  siteUserId?: string;
  siteUsername?: string;
  updatedAt: string;
  usdWager: string;
  username: string;
};

type RawLeaderboardDetailsResponse = RawLeaderboardMonth & {
  participants: {
    data: RawLeaderboardParticipant[];
    page: number;
    take: number;
    total: number;
    totalPages: number;
  };
};

export async function getLatestLeaderboardMonth(): Promise<LeaderboardMonthResponse | null> {
  const response = await authenticatedClient.get<RawLeaderboardMonthResponse>(
    "/leaderboard",
    {
      params: { page: 1, take: 1 },
    },
  );
  const latestMonth = response.data.data[0];

  if (!latestMonth) {
    return null;
  }

  return {
    month: latestMonth.month,
    title: latestMonth.title,
    updatedAt: latestMonth.updatedAt,
  };
}

export async function getLeaderboardDetails(
  month: string,
  take: number,
): Promise<LeaderboardDetailsResponse> {
  const response = await authenticatedClient.get<RawLeaderboardDetailsResponse>(
    `/leaderboard/${month}`,
    {
      params: { page: 1, take },
    },
  );

  return {
    month: response.data.month,
    title: response.data.title,
    updatedAt: response.data.updatedAt,
    participants: {
      items: response.data.participants.data.map((participant) => ({
        id:
          participant.siteUserId ??
          `${participant.month}-${participant.position}-${participant.username}`,
        position: participant.position,
        prizeType: participant.prizeType,
        prizeValue: participant.prizeValue,
        updatedAt: participant.updatedAt,
        usdWager: participant.usdWager,
        username: participant.siteUsername ?? participant.username,
      })),
      page: response.data.participants.page,
      pageSize: response.data.participants.take,
      totalItems: response.data.participants.total,
      totalPages: response.data.participants.totalPages,
    },
  };
}

export async function getLatestLeaderboardDetails(
  take: number,
): Promise<LeaderboardDetailsResponse | null> {
  const latestMonth = await getLatestLeaderboardMonth();

  if (!latestMonth) {
    return null;
  }

  return getLeaderboardDetails(latestMonth.month, take);
}
