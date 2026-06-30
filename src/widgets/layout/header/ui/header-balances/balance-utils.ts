import type { UserBalance } from "@/features/auth/lib/read-auth-response";

export function getBalanceIconType(balanceType: string) {
  if (isGamePointsBalanceType(balanceType)) {
    return "red-coin";
  }

  if (isWatchPointsBalanceType(balanceType)) {
    return "yellow-coin";
  }

  return "red-coin";
}

export function getBalanceLabel(balanceType: string) {
  if (isGamePointsBalanceType(balanceType)) {
    return "Game Points";
  }

  if (isWatchPointsBalanceType(balanceType)) {
    return "Watch Points";
  }

  return balanceType
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getBalanceTooltip(balanceType: string) {
  if (isGamePointsBalanceType(balanceType)) {
    return "Game Points are used for gameplay and rewards.";
  }

  if (isWatchPointsBalanceType(balanceType)) {
    return "Watch Points can be exchanged into Game Points and used to make purchases on the site.";
  }

  return "Points balance available on your account.";
}

export function getOrderedBalances(balances: UserBalance[]) {
  return [...balances].sort((firstBalance, secondBalance) => {
    return (
      getBalanceSortOrder(firstBalance.balanceType) -
      getBalanceSortOrder(secondBalance.balanceType)
    );
  });
}

function getBalanceSortOrder(balanceType: string) {
  if (isGamePointsBalanceType(balanceType)) {
    return 0;
  }

  if (isWatchPointsBalanceType(balanceType)) {
    return 1;
  }

  return 2;
}

function isGamePointsBalanceType(balanceType: string) {
  const normalizedBalanceType = normalizeBalanceType(balanceType);

  return normalizedBalanceType.includes("gamepoint");
}

function isWatchPointsBalanceType(balanceType: string) {
  const normalizedBalanceType = normalizeBalanceType(balanceType);

  return normalizedBalanceType.includes("watchpoint");
}

function normalizeBalanceType(balanceType: string) {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase();
}
