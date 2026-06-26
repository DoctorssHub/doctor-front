import { create } from "zustand";
import type { GameMode } from "@/entities/game/model/types";
import { sanitizeIntegerInput } from "@/widgets/game-sidebar/lib/numeric-input";
import { delay } from "../lib/keno-delay";
import { pickRandomKenoNumbers } from "../lib/keno-random-selection";
import { KENO_MAX_SELECTION, KENO_NUMBERS } from "./keno-constants";

const AUTO_PICK_DELAY_MS = 100;

export type KenoRisk = "CLASSIC" | "LOW" | "MEDIUM" | "HIGH";

const initialKenoControlsState = {
  autoBetsAmount: "10",
  autoPickingNumber: null as number | null,
  betAmount: "1.00",
  isAutoBetsInfinite: false,
  isAutoPicking: false,
  mode: "Manual" as GameMode,
  risk: "CLASSIC" as KenoRisk,
  selectedNumbers: [] as number[],
};

type BetAmountUpdate = string | ((currentAmount: string) => string);

type KenoControlsStore = typeof initialKenoControlsState & {
  autoPickNumbers: () => Promise<void>;
  clearNumbers: () => void;
  resetControls: () => void;
  setAutoBetsAmount: (amount: string) => void;
  setBetAmount: (amount: BetAmountUpdate) => void;
  setMode: (mode: GameMode) => void;
  setRisk: (risk: KenoRisk) => void;
  toggleAutoBetsInfinite: () => void;
  toggleNumber: (number: number) => void;
};


export const useKenoControlsStore = create<KenoControlsStore>((set, get) => ({
  ...initialKenoControlsState,
  autoPickNumbers: async () => {
    const { isAutoPicking, selectedNumbers } = get();
    const remainingSelectionCount =
      KENO_MAX_SELECTION - selectedNumbers.length;

    if (isAutoPicking || remainingSelectionCount <= 0) {
      return;
    }

    const numbersToSelect = pickRandomKenoNumbers(
      selectedNumbers,
      remainingSelectionCount,
    );

    set({ isAutoPicking: true });

    try {
      for (const number of numbersToSelect) {
        set({ autoPickingNumber: number });
        await delay(AUTO_PICK_DELAY_MS);

        set((state) => {
          if (
            state.selectedNumbers.includes(number) ||
            state.selectedNumbers.length >= KENO_MAX_SELECTION
          ) {
            return state;
          }

          return {
            selectedNumbers: [...state.selectedNumbers, number],
          };
        });
      }
    } finally {
      set({ autoPickingNumber: null, isAutoPicking: false });
    }
  },
  clearNumbers: () => {
    set({ selectedNumbers: [] });
  },
  resetControls: () => {
    set(initialKenoControlsState);
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
  toggleAutoBetsInfinite: () => {
    set((state) => ({
      isAutoBetsInfinite: !state.isAutoBetsInfinite,
    }));
  },
  toggleNumber: (number) => {
    set((state) => {
      if (state.isAutoPicking || !KENO_NUMBERS.includes(number)) {
        return state;
      }

      if (state.selectedNumbers.includes(number)) {
        return {
          selectedNumbers: state.selectedNumbers.filter(
            (selectedNumber) => selectedNumber !== number,
          ),
        };
      }

      if (state.selectedNumbers.length >= KENO_MAX_SELECTION) {
        return state;
      }

      return {
        selectedNumbers: [...state.selectedNumbers, number],
      };
    });
  },
}));
