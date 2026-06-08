export function multiplierColor(multiplier: number): string {
  if (multiplier >= 100) {
    return "border-[#d01528] bg-[#d01528] text-black";
  }

  if (multiplier >= 4) {
    return "border-[#dc2626] bg-[#dc2626] text-black";
  }

  if (multiplier >= 1.3) {
    return "border-[#f97316] bg-[#f97316] text-black";
  }

  if (multiplier >= 1) {
    return "border-[#eab308] bg-[#eab308] text-black";
  }

  return "border-[#22c55e] bg-[#22c55e] text-black";
}

export function getMultiplierTone(
  multiplier: number | string,
  isActive: boolean,
) {
  const value = Number(multiplier);

  if (isActive) {
    return "border-[#c82831] bg-[#c82831] text-[#fff7f7] shadow-[0_0_20px_rgb(200_40_49_/_42%)]";
  }

  return multiplierColor(Number.isFinite(value) ? value : 0);
}
