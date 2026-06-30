import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_GAME_SOUND_VOLUME = 54;

type GameSoundStore = {
  volume: number;
  setVolume: (volume: number) => void;
};

function clampVolume(volume: number) {
  return Math.min(100, Math.max(0, Math.round(volume)));
}

export const useGameSoundStore = create<GameSoundStore>()(
  persist(
    (set) => ({
      volume: DEFAULT_GAME_SOUND_VOLUME,
      setVolume: (volume) => {
        set({ volume: clampVolume(volume) });
      },
    }),
    {
      name: "game-sound-settings",
      partialize: (state) => ({ volume: state.volume }),
    },
  ),
);
