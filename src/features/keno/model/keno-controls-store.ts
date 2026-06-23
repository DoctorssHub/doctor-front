import { create } from "zustand";
import type { GameMode } from "@/entities/game/model/types";
import { KENO_MAX_SELECTION, KENO_NUMBERS } from "./keno-constants";

const AUTO_PICK_DELAY_MS = 100;

export type KenoRisk = "CLASSIC" | "LOW" | "MEDIUM" | "HIGH";

const initialKenoControlsState = {
  autoBetsAmount: "2",
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

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });
}

function pickRandomNumbers(excludedNumbers: number[], amount: number) {
  const excluded = new Set(excludedNumbers);
  const availableNumbers = KENO_NUMBERS.filter(
    (number) => !excluded.has(number),
  );

  for (let index = availableNumbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [availableNumbers[index], availableNumbers[randomIndex]] = [
      availableNumbers[randomIndex],
      availableNumbers[index],
    ];
  }

  return availableNumbers.slice(0, amount);
}

export const useKenoControlsStore = create<KenoControlsStore>((set, get) => ({
  ...initialKenoControlsState,
  autoPickNumbers: async () => {
    const { isAutoPicking, selectedNumbers } = get();
    const remainingSelectionCount =
      KENO_MAX_SELECTION - selectedNumbers.length;

    if (isAutoPicking || remainingSelectionCount <= 0) {
      return;
    }

    const numbersToSelect = pickRandomNumbers(
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
    set({ autoBetsAmount });
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
      if (!KENO_NUMBERS.includes(number)) {
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
