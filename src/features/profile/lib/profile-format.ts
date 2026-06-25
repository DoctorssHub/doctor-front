export function formatPointsValue(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return value.trim();
  }

  return "0.00";
}

export type BalanceIconType = "coin" | "dot";

export function getBalanceIconType(balanceType: string): BalanceIconType {
  return normalizeBalanceType(balanceType).includes("gamepoint")
    ? "coin"
    : "dot";
}

export function getUsernameInitial(username: string | null): string {
  const trimmed = username?.trim();

  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function normalizeBalanceType(balanceType: string): string {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase();
}
