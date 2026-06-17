import { create } from "zustand";
import type { ProvablyFairGame } from "./provably-fair-games";

type ProvablyFairModalStore = {
  initialGame: ProvablyFairGame;
  isOpen: boolean;
  openKey: number;
  closeProvablyFairModal: () => void;
  openProvablyFairModal: (game?: ProvablyFairGame) => void;
};

export const useProvablyFairModalStore = create<ProvablyFairModalStore>(
  (set) => ({
    initialGame: "roulette",
    isOpen: false,
    openKey: 0,
    closeProvablyFairModal: () => set({ isOpen: false }),
    openProvablyFairModal: (game = "roulette") =>
      set((state) => ({
        initialGame: game,
        isOpen: true,
        openKey: state.openKey + 1,
      })),
  }),
);
