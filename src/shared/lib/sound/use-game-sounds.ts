"use client";

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

const MAX_AUDIO_POOL_SIZE = 4;

type GameSoundKey = keyof typeof GAME_SOUND_PATHS;
type GameSounds = Record<`play${Capitalize<GameSoundKey>}`, () => void>;

const audioPools = new Map<GameSoundKey, HTMLAudioElement[]>();

function createAudio(sound: GameSoundKey) {
  if (typeof Audio === "undefined") {
    return null;
  }

  const audio = new Audio(GAME_SOUND_PATHS[sound]);
  audio.preload = "auto";

  return audio;
}

function getAudio(sound: GameSoundKey) {
  const audioPool = audioPools.get(sound) ?? [];
  const availableAudio = audioPool.find((audio) => audio.paused || audio.ended);

  if (availableAudio) {
    return availableAudio;
  }

  if (audioPool.length < MAX_AUDIO_POOL_SIZE) {
    const audio = createAudio(sound);

    if (!audio) {
      return null;
    }

    audioPool.push(audio);
    audioPools.set(sound, audioPool);

    return audio;
  }

  return audioPool[0] ?? null;
}

function playGameSound(sound: GameSoundKey) {
  const { volume } = useGameSoundStore.getState();

  if (volume <= 0) {
    return;
  }

  const audio = getAudio(sound);

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume / 100;
  void audio.play().catch(() => undefined);
}

const gameSounds: GameSounds = {
  playBet: () => playGameSound("bet"),
  playGeneric: () => playGameSound("generic"),
  playMatch: () => playGameSound("match"),
  playPocket: () => playGameSound("pocket"),
  playRevealed: () => playGameSound("revealed"),
  playRolling: () => playGameSound("rolling"),
  playRoulette: () => playGameSound("roulette"),
  playScore: () => playGameSound("score"),
  playSelected: () => playGameSound("selected"),
  playStarShine: () => playGameSound("starShine"),
  playThrow: () => playGameSound("throw"),
  playTick: () => playGameSound("tick"),
  playWin: () => playGameSound("win"),
};

export function useGameSounds() {
  return gameSounds;
}
