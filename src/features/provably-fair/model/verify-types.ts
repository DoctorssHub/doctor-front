import type { ProvablyFairGame } from "./provably-fair-games";
import type { Risk } from "@/entities/game/model/types";

export type FairnessVerifyResult =
  | {
      game: Extract<ProvablyFairGame, "roulette">;
      number: number;
    }
  | {
      game: Extract<ProvablyFairGame, "dice">;
      roll: number;
    }
  | {
      game: Extract<ProvablyFairGame, "keno">;
      tiles: number[];
    }
  | {
      bucketIndex: number;
      game: Extract<ProvablyFairGame, "plinko">;
      multiplier: number;
      risk: Risk;
      rows: number;
    };
