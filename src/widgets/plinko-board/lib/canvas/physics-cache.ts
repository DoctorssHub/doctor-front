import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";
import type { BallMotion } from "./physics-types";

const maxMotionCacheSize = 180;
const maxVelocityCacheSize = 180;
const motionCache = new Map<string, BallMotion>();
const initialVelocityCache = new Map<string, number>();

export function getBallMotionCacheKey(
  layout: BoardLayout,
  rows: number,
  bucketIndex: number,
  seed: string,
) {
  return `${layout}:${rows}:${bucketIndex}:${seed}`;
}

export function getInitialVelocityCacheKey(
  layout: BoardLayout,
  rows: number,
  bucketIndex: number,
) {
  return `${layout}:${rows}:${bucketIndex}`;
}

export function getCachedBallMotion(key: string) {
  return getCachedValue(motionCache, key);
}

export function setCachedBallMotion(key: string, motion: BallMotion) {
  setCachedValue(motionCache, key, motion, maxMotionCacheSize);
}

export function getCachedInitialVelocity(key: string) {
  return getCachedValue(initialVelocityCache, key);
}

export function setCachedInitialVelocity(key: string, velocity: number) {
  setCachedValue(initialVelocityCache, key, velocity, maxVelocityCacheSize);
}

function getCachedValue<TKey, TValue>(cache: Map<TKey, TValue>, key: TKey) {
  const value = cache.get(key);

  if (value === undefined) {
    return undefined;
  }

  cache.delete(key);
  cache.set(key, value);

  return value;
}

function setCachedValue<TKey, TValue>(
  cache: Map<TKey, TValue>,
  key: TKey,
  value: TValue,
  maxSize: number,
) {
  cache.delete(key);
  cache.set(key, value);

  if (cache.size <= maxSize) {
    return;
  }

  const oldestKey = cache.keys().next().value;

  if (oldestKey !== undefined) {
    cache.delete(oldestKey);
  }
}
