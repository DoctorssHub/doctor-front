export function formatKenoAmount(amount: string) {
  const parsedAmount = Number(amount);

  return Number.isFinite(parsedAmount) ? parsedAmount.toFixed(2) : amount;
}
