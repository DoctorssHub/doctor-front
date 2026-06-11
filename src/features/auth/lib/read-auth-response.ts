export type UserBalance = {
  balanceType: string;
  value: string;
};

export function readUsername(data: unknown) {
  return findUsername(data);
}

export function readUserBalances(data: unknown) {
  const balances = findUserBalances(data);

  return balances.length > 0 ? balances : null;
}

function findUsername(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  for (const key of ["username", "userName"]) {
    const value = record[key];

    if (typeof value === "string" && value.trim() && !value.includes("@")) {
      return value.trim();
    }
  }

  for (const value of Object.values(record)) {
    const nestedValue = findUsername(value);

    if (nestedValue) {
      return nestedValue;
    }
  }

  return null;
}

function findUserBalances(data: unknown): UserBalance[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const userBalances = record.userBalances;

  if (Array.isArray(userBalances)) {
    return userBalances.flatMap(readUserBalance);
  }

  for (const value of Object.values(record)) {
    const nestedValue = findUserBalances(value);

    if (nestedValue.length > 0) {
      return nestedValue;
    }
  }

  return [];
}

function readUserBalance(value: unknown): UserBalance[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const balanceType = record.balanceType;
  const balanceValue = record.value;

  if (typeof balanceType !== "string" || !balanceType.trim()) {
    return [];
  }

  const formattedValue = formatBalanceValue(balanceValue);

  return formattedValue === null
    ? []
    : [
        {
          balanceType: balanceType.trim(),
          value: formattedValue,
        },
      ];
}

function formatBalanceValue(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US");
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsedValue = Number(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue)
    ? parsedValue.toLocaleString("en-US")
    : value.trim();
}
