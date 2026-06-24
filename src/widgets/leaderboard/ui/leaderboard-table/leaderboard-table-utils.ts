export function formatMoney(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `$${value}`;
  }

  return `$${new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
