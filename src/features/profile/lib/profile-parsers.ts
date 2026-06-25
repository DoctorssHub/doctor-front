import type {
  ProfileSettings,
  ProfileSettingsResponse,
  ProfileStats,
  ProfileStatsResponse,
} from "../api/profile-types";
import { formatPointsValue } from "./profile-format";

export function parseProfileStats(
  data: ProfileStatsResponse | unknown,
): ProfileStats {
  const totalWagered = findNumericField(data, [
    "totalWagered",
    "wagered",
    "totalWager",
  ]);
  const wagerPointsSpent = findNumericField(data, [
    "wagerPointsSpent",
    "pointsSpent",
    "wagerSpent",
  ]);

  return {
    totalWagered: formatPointsValue(totalWagered),
    wagerPointsSpent: formatPointsValue(wagerPointsSpent),
  };
}

export function parseProfileSettings(
  data: ProfileSettingsResponse | unknown,
): ProfileSettings {
  return {
    privateMode: findBooleanField(data, ["privateMode", "isPrivate", "private"]),
  };
}

function findNumericField(
  data: unknown,
  keys: string[],
): number | string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" || typeof value === "string") {
      return value;
    }
  }

  for (const value of Object.values(record)) {
    const nested = findNumericField(value, keys);

    if (nested !== null) {
      return nested;
    }
  }

  return null;
}

function findBooleanField(data: unknown, keys: string[]): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  const record = data as Record<string, unknown>;

  for (const key of keys) {
    if (typeof record[key] === "boolean") {
      return record[key] as boolean;
    }
  }

  for (const value of Object.values(record)) {
    if (value && typeof value === "object") {
      const nested = findBooleanField(value, keys);

      if (nested) {
        return nested;
      }
    }
  }

  return false;
}
