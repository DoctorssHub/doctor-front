export function multiplierColor(multiplier: number): string {
  if (multiplier >= 100) {
    return "border-[#b91c1c] bg-[linear-gradient(180deg,#ef4444_0%,#b91c1c_100%)] text-black";
  }

  if (multiplier >= 4) {
    return "border-[#b91c1c] bg-[linear-gradient(180deg,#ef4444_0%,#b91c1c_100%)] text-black";
  }

  if (multiplier >= 1.3) {
    return "border-[#c2410c] bg-[linear-gradient(180deg,#f97316_0%,#c2410c_100%)] text-black";
  }

  if (multiplier >= 1) {
    return "border-[#ca8a04] bg-[linear-gradient(180deg,#facc15_0%,#ca8a04_100%)] text-black";
  }

  return "border-[#16a34a] bg-[linear-gradient(180deg,#22c55e_0%,#16a34a_100%)] text-black";
}

export function multiplierGlow(multiplier: number): string {
  if (multiplier >= 4) {
    return "shadow-[0_0_20px_rgb(239_68_68_/_42%)]";
  }

  if (multiplier >= 1.3) {
    return "shadow-[0_0_20px_rgb(249_115_22_/_42%)]";
  }

  if (multiplier >= 1) {
    return "shadow-[0_0_20px_rgb(250_204_21_/_42%)]";
  }

  return "shadow-[0_0_20px_rgb(34_197_94_/_42%)]";
}

export function getMultiplierTone(
  multiplier: number | string,
  isActive: boolean,
) {
  const value = Number(multiplier);
  const safeValue = Number.isFinite(value) ? value : 0;

  const baseTone = multiplierColor(safeValue);

  return isActive ? `${baseTone} ${multiplierGlow(safeValue)}` : baseTone;
}
