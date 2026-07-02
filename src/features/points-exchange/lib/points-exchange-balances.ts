import type { UserBalance } from "@/features/auth/lib/read-auth-response";

export function findWatchPointsBalance(balances: UserBalance[]) {
  return balances.find((balance) =>
    isWatchPointsBalanceType(balance.balanceType),
  );
}

export function findGamePointsBalance(balances: UserBalance[]) {
  return balances.find((balance) =>
    isGamePointsBalanceType(balance.balanceType),
  );
}

export function updateExchangeBalances({
  balances,
  gamePointsBalance,
  watchPointsBalance,
}: {
  balances: UserBalance[];
  gamePointsBalance: number;
  watchPointsBalance: number;
}) {
  const nextBalances = balances.map((balance) => {
    if (isWatchPointsBalanceType(balance.balanceType)) {
      return {
        ...balance,
        value: formatBalanceValue(watchPointsBalance),
      };
    }

    if (isGamePointsBalanceType(balance.balanceType)) {
      return {
        ...balance,
        value: formatBalanceValue(gamePointsBalance),
      };
    }

    return balance;
  });

  return ensureBalance(
    ensureBalance(nextBalances, "WATCH_POINTS", watchPointsBalance),
    "GAME_POINTS",
    gamePointsBalance,
  );
}

export function readNumericBalanceValue(balance: UserBalance | undefined) {
  const value = Number(balance?.value?.replace(/,/g, "") ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function ensureBalance(
  balances: UserBalance[],
  balanceType: string,
  value: number,
) {
  const hasBalance = balances.some(
    (balance) =>
      normalizeBalanceType(balance.balanceType) ===
      normalizeBalanceType(balanceType),
  );

  if (hasBalance) {
    return balances;
  }

  return [
    ...balances,
    {
      balanceType,
      value: formatBalanceValue(value),
    },
  ];
}

function formatBalanceValue(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function isGamePointsBalanceType(balanceType: string) {
  return normalizeBalanceType(balanceType).includes("gamepoint");
}

function isWatchPointsBalanceType(balanceType: string) {
  return normalizeBalanceType(balanceType).includes("watchpoint");
}

function normalizeBalanceType(balanceType: string) {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase();
}
