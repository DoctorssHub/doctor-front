"use client";

import { useMemo } from "react";
import useSound from "use-sound";
import { useGameSoundStore } from "@/shared/model/game-sound-store";

const GAME_SOUND_PATHS = {
  bet: "/sounds/bet.mp3",
  generic: "/sounds/generic.mp3",
  match: "/sounds/match.mp3",
  pocket: "/sounds/pocket.mp3",
  revealed: "/sounds/revealed.mp3",
  rolling: "/sounds/rolling.mp3",
  roulette: "/sounds/roulette.mp3",
  score: "/sounds/score.mp3",
  selected: "/sounds/selected.mp3",
  starShine: "/sounds/star-shine.mp3",
  throw: "/sounds/throw.mp3",
  tick: "/sounds/tick.mp3",
  win: "/sounds/win.mp3",
} as const;

export function useGameSounds() {
  const volume = useGameSoundStore((state) => state.volume);
  const soundVolume = volume / 100;
  const soundEnabled = volume > 0;
  const soundOptions = {
    soundEnabled,
    volume: soundVolume,
  };
  const [playBet] = useSound(GAME_SOUND_PATHS.bet, soundOptions);
  const [playGeneric] = useSound(GAME_SOUND_PATHS.generic, soundOptions);
  const [playMatch] = useSound(GAME_SOUND_PATHS.match, soundOptions);
  const [playPocket] = useSound(GAME_SOUND_PATHS.pocket, soundOptions);
  const [playRevealed] = useSound(GAME_SOUND_PATHS.revealed, soundOptions);
  const [playRolling] = useSound(GAME_SOUND_PATHS.rolling, soundOptions);
  const [playRoulette] = useSound(GAME_SOUND_PATHS.roulette, soundOptions);
  const [playScore] = useSound(GAME_SOUND_PATHS.score, soundOptions);
  const [playSelected] = useSound(GAME_SOUND_PATHS.selected, soundOptions);
  const [playStarShine] = useSound(GAME_SOUND_PATHS.starShine, soundOptions);
  const [playThrow] = useSound(GAME_SOUND_PATHS.throw, soundOptions);
  const [playTick] = useSound(GAME_SOUND_PATHS.tick, soundOptions);
  const [playWin] = useSound(GAME_SOUND_PATHS.win, soundOptions);

  return useMemo(
    () => ({
      playBet,
      playGeneric,
      playMatch,
      playPocket,
      playRevealed,
      playRolling,
      playRoulette,
      playScore,
      playSelected,
      playStarShine,
      playThrow,
      playTick,
      playWin,
    }),
    [
      playBet,
      playGeneric,
      playMatch,
      playPocket,
      playRevealed,
      playRolling,
      playRoulette,
      playScore,
      playSelected,
      playStarShine,
      playThrow,
      playTick,
      playWin,
    ],
  );
}
