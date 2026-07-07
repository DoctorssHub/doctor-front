export type TurboModeGame = "roulette" | "dice" | "keno" | "plinko";

const NORMAL_TURBO_TIMING_SCALE = 1;

const TURBO_MODE_CONFIG = {
  dice: {
    autoBetDelayMs: 300,
    instantResult: true,
  },
  keno: {
    autoBetDelayMs: 900,
    instantReveal: true,
  },
  plinko: {
    autoBetDelayMs: 300,
    timingScale: 0.35,
  },
  roulette: {
    autoBetDelayMs: 2200,
    timingScale: 0.35,
  },
} as const satisfies Record<TurboModeGame, object | null>;

export function getTurboModeConfig(game: TurboModeGame) {
  return TURBO_MODE_CONFIG[game];
}

export function isTurboModeAvailable(game: TurboModeGame) {
  return getTurboModeConfig(game) !== null;
}

export function getTurboAutoBetDelay(
  game: TurboModeGame,
  normalDelayMs: number,
  isTurboModeEnabled: boolean,
) {
  if (!isTurboModeEnabled) {
    return normalDelayMs;
  }

  const config = getTurboModeConfig(game);

  return config && "autoBetDelayMs" in config
    ? config.autoBetDelayMs
    : normalDelayMs;
}

export function getPlinkoTurboTimingScale(isTurboModeEnabled: boolean) {
  return getTurboTimingScale("plinko", isTurboModeEnabled);
}

export function getTurboTimingScale(
  game: TurboModeGame,
  isTurboModeEnabled: boolean,
) {
  const config = getTurboModeConfig(game);

  return isTurboModeEnabled && config && "timingScale" in config
    ? config.timingScale
    : NORMAL_TURBO_TIMING_SCALE;
}
