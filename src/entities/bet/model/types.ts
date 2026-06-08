import type { Risk } from "@/entities/game/model/types";

export type Bet = {
  betId: string;
  amount: string;
  payout: string;
  multiplier: number;
  rows: number;
  risk: Risk;
  bucketIndex: number;
  path: string;
};
