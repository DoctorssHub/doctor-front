import { create } from "zustand";

type KenoBettingStore = {
  isAutoBetStopRequested: boolean;
  isAutoBetting: boolean;
  requestAutoBetStop: () => void;
  resetBetting: () => void;
  setAutoBetStopRequested: (isAutoBetStopRequested: boolean) => void;
  setAutoBetting: (isAutoBetting: boolean) => void;
};

const initialKenoBettingState = {
  isAutoBetStopRequested: false,
  isAutoBetting: false,
};

export const useKenoBettingStore = create<KenoBettingStore>((set) => ({
  ...initialKenoBettingState,
  requestAutoBetStop: () => {
    set({ isAutoBetStopRequested: true });
  },
  resetBetting: () => {
    set(initialKenoBettingState);
  },
  setAutoBetStopRequested: (isAutoBetStopRequested) => {
    set({ isAutoBetStopRequested });
  },
  setAutoBetting: (isAutoBetting) => {
    set({ isAutoBetting });
  },
}));