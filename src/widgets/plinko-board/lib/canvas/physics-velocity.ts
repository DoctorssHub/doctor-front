export function getSeededInitialVelocityX(bucketIndex: number, rows: number) {
  const normalizedTarget = bucketIndex / Math.max(1, rows) - 0.5;
  const targetBias =
    Math.sign(normalizedTarget) *
    Math.pow(Math.abs(normalizedTarget), 0.72) *
    430;
  const deterministicJitter = ((bucketIndex * 37 + rows * 17) % 41) - 20;

  return targetBias + deterministicJitter;
}
