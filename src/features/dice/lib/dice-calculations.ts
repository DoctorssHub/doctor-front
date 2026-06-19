export const DICE_MIN_THRESHOLD = 0.01;
export const DICE_MAX_THRESHOLD = 99.99;
export const DICE_DEFAULT_RTP = 0.99;
export const DICE_DEFAULT_MAX_MULTIPLIER = 9900;

export function clampDiceThreshold(threshold: number) {
  return clamp(threshold, DICE_MIN_THRESHOLD, DICE_MAX_THRESHOLD);
}

export function getDiceChance(threshold: number, above: boolean) {
  const chance = above ? 100 - threshold : threshold;

  return roundTo(clamp(chance, DICE_MIN_THRESHOLD, DICE_MAX_THRESHOLD), 4);
}

export function getDiceMultiplier(
  chance: number,
  rtp = DICE_DEFAULT_RTP,
  maxMultiplier = DICE_DEFAULT_MAX_MULTIPLIER,
) {
  const multiplier = (rtp * 100) / clamp(chance, DICE_MIN_THRESHOLD, 100);

  return roundTo(clamp(multiplier, 1.01, maxMultiplier), 2);
}

export function getDiceChanceFromMultiplier(
  multiplier: number,
  rtp = DICE_DEFAULT_RTP,
  maxMultiplier = DICE_DEFAULT_MAX_MULTIPLIER,
) {
  const safeMultiplier = clamp(multiplier, 1.01, maxMultiplier);

  return roundTo(clamp((rtp * 100) / safeMultiplier, 0.01, 99), 4);
}

export function getDiceThresholdFromChance(chance: number, above: boolean) {
  const safeChance = clamp(chance, DICE_MIN_THRESHOLD, DICE_MAX_THRESHOLD);
  const threshold = above ? 100 - safeChance : safeChance;

  return roundTo(clampDiceThreshold(threshold), 2);
}

export function getDiceProfitOnWin(betAmount: string, multiplier: number) {
  const betValue = Number(betAmount);

  if (!Number.isFinite(betValue) || betValue <= 0) {
    return "0.00";
  }

  return formatDiceAmount(betValue * multiplier - betValue);
}

export function formatDiceAmount(amount: number) {
  return amount.toFixed(2);
}

export function formatDiceNumber(value: number, decimals = 2) {
  return value.toFixed(decimals);
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}
