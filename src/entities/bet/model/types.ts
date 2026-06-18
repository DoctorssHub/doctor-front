export type Bet = {
  betId: string;
  betSize: string;
  bucketIndex: number;
  createdAt: string;
  payout: string;
  multiplier: number;
};

export type GameType = "roulette" | "keno" | "plinko" | "dice";

export type BetHistoryUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type BetHistoryItem = {
  id: string;
  user: BetHistoryUser;
  game: string;
  betAmount: string;
  multiplier: number;
  prize: string;
  createdAt: string;
};
