export type DiceConfigResponse = {
  rtp: number;
  maxBet: number;
  minBet: number;
  maxMultiplier: number;
};

export type DiceBetRequest = {
  betSize: string;
  threshold: number;
  above: boolean;
};

export type DiceBetResponse = {
  createdAt: string;
  betId: string;
  betSize: string;
  payout: string;
  multiplier: number;
  randomValue: number;
  threshold: number;
  above: boolean;
  didWin: boolean;
};
