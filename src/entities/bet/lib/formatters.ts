export function formatBetMultiplier(multiplier: number): string {
  return `x${multiplier.toFixed(2)}`;
}

export function formatBetDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatBetAmount(value: string): string {
  return value;
}
