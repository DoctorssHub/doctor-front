import { create } from "zustand";

type PlinkoBettingStore = {
  betValidationError: string;
  clearBetValidationError: () => void;
  isAutoBetStopRequested: boolean;
  isAutoBetting: boolean;
  isBetting: boolean;
  requestAutoBetStop: () => void;
  resetBetting: () => void;
  setAutoBetStopRequested: (isAutoBetStopRequested: boolean) => void;
  setAutoBetting: (isAutoBetting: boolean) => void;
  setBetValidationError: (betValidationError: string) => void;
  setBetting: (isBetting: boolean) => void;
};

const initialPlinkoBettingState = {
  betValidationError: "",
  isAutoBetStopRequested: false,
  isAutoBetting: false,
  isBetting: false,
};

export const usePlinkoBettingStore = create<PlinkoBettingStore>((set) => ({
  ...initialPlinkoBettingState,
  clearBetValidationError: () => {
    set({ betValidationError: "" });
  },
  requestAutoBetStop: () => {
    set({ isAutoBetStopRequested: true });
  },
  resetBetting: () => {
    set(initialPlinkoBettingState);
  },
  setAutoBetStopRequested: (isAutoBetStopRequested) => {
    set({ isAutoBetStopRequested });
  },
  setAutoBetting: (isAutoBetting) => {
    set({ isAutoBetting });
  },
  setBetValidationError: (betValidationError) => {
    set({ betValidationError });
  },
  setBetting: (isBetting) => {
    set({ isBetting });
  },
}));
