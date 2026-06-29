import { create } from "zustand";
import type { GameMode, Risk } from "@/entities/game/model/types";
import { sanitizeIntegerInput } from "@/shared/ui/game-sidebar/lib/numeric-input";

const initialPlinkoControlsState = {
  autoBetsAmount: "10",
  betAmount: "1.00",
  isAutoBetsInfinite: false,
  mode: "Manual" as GameMode,
  risk: "LOW" as Risk,
  rows: 8,
};

type BetAmountUpdate = string | ((currentAmount: string) => string);

type PlinkoControlsStore = typeof initialPlinkoControlsState & {
  resetControls: () => void;
  setAutoBetsAmount: (amount: string) => void;
  setBetAmount: (amount: BetAmountUpdate) => void;
  setMode: (mode: GameMode) => void;
  setRisk: (risk: Risk) => void;
  setRows: (rows: number) => void;
  toggleAutoBetsInfinite: () => void;
};

export const usePlinkoControlsStore = create<PlinkoControlsStore>((set) => ({
  ...initialPlinkoControlsState,
  resetControls: () => {
    set(initialPlinkoControlsState);
  },
  setAutoBetsAmount: (autoBetsAmount) => {
    set({ autoBetsAmount: sanitizeIntegerInput(autoBetsAmount) });
  },
  setBetAmount: (betAmount) => {
    set((state) => ({
      betAmount:
        typeof betAmount === "function"
          ? betAmount(state.betAmount)
          : betAmount,
    }));
  },
  setMode: (mode) => {
    set({ mode });
  },
  setRisk: (risk) => {
    set({ risk });
  },
  setRows: (rows) => {
    set({ rows });
  },
  toggleAutoBetsInfinite: () => {
    set((state) => ({
      isAutoBetsInfinite: !state.isAutoBetsInfinite,
    }));
  },
}));
