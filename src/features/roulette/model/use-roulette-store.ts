import { create } from "zustand";
import type { RouletteBetResponse } from "../api/roulette-types";
import type { NewRouletteBet, PlacedRouletteBet } from "./roulette-bets";

export type RouletteResult = {
  betId: string;
  number: number;
  betSize: string;
  payout: string;
  multiplier: number;
  createdAt: string;
};

type RouletteStore = {
  selectedChip: number;
  placedBets: PlacedRouletteBet[];
  isSpinning: boolean;
  result: RouletteResult | null;
  resultHistory: RouletteResult[];
  selectChip: (chip: number) => void;
  placeBet: (bet: NewRouletteBet) => void;
  clearBets: () => void;
  undoBet: () => void;
  startSpin: () => void;
  finishSpin: (
    response: RouletteBetResponse,
    options?: { clearBets?: boolean },
  ) => void;
  addResultToHistory: () => void;
  stopSpin: () => void;
  resetResult: () => void;
  settleResultHistory: () => void;
};

function createBetId() {
  return globalThis.crypto?.randomUUID?.() ?? `roulette-bet-${Date.now()}`;
}

export const useRouletteStore = create<RouletteStore>()((set, get) => ({
  selectedChip: 1,
  placedBets: [],
  isSpinning: false,
  result: null,
  resultHistory: [],
  selectChip: (chip) => {
    set({ selectedChip: chip });
  },
  placeBet: (bet) => {
    const { selectedChip } = get();

    set((state) => ({
      placedBets: [
        ...state.placedBets,
        {
          ...bet,
          id: createBetId(),
          amount: selectedChip,
        },
      ],
      result: null,
    }));
  },
  clearBets: () => {
    set({ placedBets: [], result: null });
  },
  undoBet: () => {
    set((state) => ({
      placedBets: state.placedBets.slice(0, -1),
    }));
  },
  startSpin: () => {
    set({ isSpinning: true, result: null });
  },
  finishSpin: (response, options) => {
    const result = {
      betId: response.betId,
      number: response.randomPosition,
      betSize: response.betSize,
      payout: response.payout,
      multiplier: response.multiplier,
      createdAt: response.createdAt,
    };

    set((state) => ({
      isSpinning: false,
      result,
      placedBets: options?.clearBets === false ? state.placedBets : [],
    }));
  },
  addResultToHistory: () => {
    set((state) => {
      if (!state.result) {
        return state;
      }

      if (
        state.resultHistory.some(
          (historyResult) => historyResult.betId === state.result?.betId,
        )
      ) {
        return state;
      }

      return {
        resultHistory: [...state.resultHistory, state.result].slice(-6),
      };
    });
  },
  stopSpin: () => {
    set({ isSpinning: false });
  },
  resetResult: () => {
    set({ result: null });
  },
  settleResultHistory: () => {
    set((state) => ({
      resultHistory: state.resultHistory.slice(-5),
    }));
  },
}));
