export type LeaderboardMonthResponse = {
  month: string;
  title: string;
  updatedAt: string;
};

export type LeaderboardParticipant = {
  id: string;
  position: number;
  prizeType: string;
  prizeValue: string;
  updatedAt: string;
  usdWager: string;
  username: string;
};

export type LeaderboardDetailsResponse = LeaderboardMonthResponse & {
  participants: {
    items: LeaderboardParticipant[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
