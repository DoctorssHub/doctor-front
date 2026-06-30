"use client";

import { useGameSoundStore } from "@/shared/model/game-sound-store";

const GAME_SOUND_PATHS = {
  bet: "/sounds/bet.mp3",
  generic: "/sounds/generic.mp3",
  match: "/sounds/match.mp3",
  pocket: "/sounds/pocket.mp3",
  revealed: "/sounds/revealed.mp3",
  roulette: "/sounds/roulette.mp3",
  selected: "/sounds/selected.mp3",
  throw: "/sounds/throw.mp3",
  tick: "/sounds/tick.mp3",
  win: "/sounds/win.mp3",
} as const;

const MAX_AUDIO_POOL_SIZE = 4;
const MIN_IMPACT_SOUND_INTERVAL_MS = 50;

type GameSoundKey = keyof typeof GAME_SOUND_PATHS;
type BetStartGame = "dice" | "keno" | "plinko" | "roulette";
type ResultLossSound = "pocket" | "revealed";

type PlayGameSoundOptions = {
  interrupt?: boolean;
};

type GameSounds = {
  playBetStart: (game: BetStartGame) => void;
  playChipPlacement: (kind: "straight" | "group") => void;
  playClear: () => void;
  playImpact: () => void;
  playMatch: () => void;
  playResult: (options: { didWin: boolean; lossSound: ResultLossSound }) => void;
  playReveal: () => void;
  playSelection: () => void;
  stop: (sound: GameSoundKey) => void;
};

const BET_START_SOUNDS: Record<BetStartGame, GameSoundKey> = {
  dice: "throw",
  keno: "bet",
  plinko: "bet",
  roulette: "roulette",
};

const audioPools = new Map<GameSoundKey, HTMLAudioElement[]>();
let lastImpactSoundAt = 0;

function createAudio(sound: GameSoundKey) {
  if (typeof Audio === "undefined") {
    return null;
  }

  const audio = new Audio(GAME_SOUND_PATHS[sound]);
  audio.preload = "auto";

  return audio;
}

function getAudio(sound: GameSoundKey, options: PlayGameSoundOptions = {}) {
  const { interrupt = true } = options;
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

  return interrupt ? audioPool[0] ?? null : null;
}

function stopGameSound(sound: GameSoundKey) {
  const audioPool = audioPools.get(sound) ?? [];

  for (const audio of audioPool) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function playGameSound(sound: GameSoundKey, options?: PlayGameSoundOptions) {
  const { volume } = useGameSoundStore.getState();

  if (volume <= 0) {
    return;
  }

  const audio = getAudio(sound, options);

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume / 100;
  void audio.play().catch(() => undefined);
}

export const gameSounds: GameSounds = {
  playBetStart: (game) => {
    const sound = BET_START_SOUNDS[game];

    if (sound === "roulette") {
      stopGameSound(sound);
    }

    playGameSound(sound);
  },
  playChipPlacement: (kind) =>
    playGameSound(kind === "straight" ? "tick" : "bet"),
  playClear: () => playGameSound("generic"),
  playImpact: () => {
    const now = performance.now();

    if (now - lastImpactSoundAt < MIN_IMPACT_SOUND_INTERVAL_MS) {
      return;
    }

    lastImpactSoundAt = now;
    playGameSound("tick", { interrupt: false });
  },
  playMatch: () => playGameSound("match"),
  playResult: ({ didWin, lossSound }) => {
    playGameSound(didWin ? "win" : lossSound);
  },
  playReveal: () => playGameSound("revealed"),
  playSelection: () => playGameSound("selected"),
  stop: stopGameSound,
};
