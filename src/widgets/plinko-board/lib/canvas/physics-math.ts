export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function getSeedValue(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash / 0xffffffff;
}
