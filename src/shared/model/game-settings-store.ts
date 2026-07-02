import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameSettingsStore = {
  isMaxBetControlEnabled: boolean;
  setMaxBetControlEnabled: (isEnabled: boolean) => void;
  toggleMaxBetControl: () => void;
};

export const useGameSettingsStore = create<GameSettingsStore>()(
  persist(
    (set) => ({
      isMaxBetControlEnabled: false,
      setMaxBetControlEnabled: (isEnabled) => {
        set({ isMaxBetControlEnabled: isEnabled });
      },
      toggleMaxBetControl: () => {
        set((state) => ({
          isMaxBetControlEnabled: !state.isMaxBetControlEnabled,
        }));
      },
    }),
    {
      name: "game-settings",
      partialize: (state) => ({
        isMaxBetControlEnabled: state.isMaxBetControlEnabled,
      }),
    },
  ),
);
