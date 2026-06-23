import type { KenoRisk } from "../model/keno-controls-store";

export type KenoBetRequest = {
  betSize: string;
  risk: KenoRisk;
  selected: number[];
};

export type KenoBetResponse = {
  createdAt: string;
  betId: string;
  betSize: string;
  payout: string;
  multiplier: number;
  results: number[];
};
export type KenoConfigResponse = unknown;
