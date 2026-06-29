import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";

export type ActiveRound = {
  id: string;
  bet: Bet;
  mode: GameMode;
  rows: number;
  risk: Risk;
  isResultVisible: boolean;
};
