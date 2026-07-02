import { create } from "zustand";

type PointsExchangeModalStore = {
  isOpen: boolean;
  openKey: number;
  closePointsExchangeModal: () => void;
  openPointsExchangeModal: () => void;
};

export const usePointsExchangeModalStore = create<PointsExchangeModalStore>(
  (set) => ({
    isOpen: false,
    openKey: 0,
    closePointsExchangeModal: () => set({ isOpen: false }),
    openPointsExchangeModal: () =>
      set((state) => ({
        isOpen: true,
        openKey: state.openKey + 1,
      })),
  }),
);
