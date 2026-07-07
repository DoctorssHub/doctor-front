import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameSettingsStore = {
  isTurboModeEnabled: boolean;
  isMaxBetControlEnabled: boolean;
  setTurboModeEnabled: (isEnabled: boolean) => void;
  setMaxBetControlEnabled: (isEnabled: boolean) => void;
  toggleTurboMode: () => void;
  toggleMaxBetControl: () => void;
};

export const useGameSettingsStore = create<GameSettingsStore>()(
  persist(
    (set) => ({
      isTurboModeEnabled: false,
      isMaxBetControlEnabled: false,
      setTurboModeEnabled: (isEnabled) => {
        set({ isTurboModeEnabled: isEnabled });
      },
      setMaxBetControlEnabled: (isEnabled) => {
        set({ isMaxBetControlEnabled: isEnabled });
      },
      toggleTurboMode: () => {
        set((state) => ({
          isTurboModeEnabled: !state.isTurboModeEnabled,
        }));
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
        isTurboModeEnabled: state.isTurboModeEnabled,
        isMaxBetControlEnabled: state.isMaxBetControlEnabled,
      }),
    },
  ),
);
