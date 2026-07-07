type BalanceLike = {
  balanceType: string;
  value: string;
};

export function readFormattedBalanceValue(
  value: number | string | null | undefined,
) {
  if (value === null || value === undefined) {
    return null;
  }

  const parsedValue =
    typeof value === "number" ? value : Number(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function isGamePointsBalanceType(balanceType: string) {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase().includes("gamepoint");
}

export function findGamePointsBalance<TBalance extends BalanceLike>(
  balances: TBalance[] | null | undefined,
) {
  return balances?.find((balance) =>
    isGamePointsBalanceType(balance.balanceType),
  );
}

export function getGamePointsBalanceValue(
  balances: BalanceLike[] | null | undefined,
) {
  const balance = findGamePointsBalance(balances);

  return readFormattedBalanceValue(balance?.value) ?? 0;
}
