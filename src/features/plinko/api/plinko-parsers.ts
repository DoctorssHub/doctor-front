import type { Bet } from "@/entities/bet/model/types";
import type { GameConfig, Risk } from "@/entities/game/model/types";

export type PlinkoBetRequest = {
  amount: string;
  balanceType?: string;
  risk: Risk;
  rows: number;
};

export function readPlinkoConfig(
  data: unknown,
  fallbackConfig: GameConfig,
): GameConfig {
  const config = findRecord(data);

  if (!config) {
    return fallbackConfig;
  }

  return {
    rows: readNumberArray(config.rows) || fallbackConfig.rows,
    risks: readRiskArray(config.risks) || fallbackConfig.risks,
    minBet: readString(config.minBet) || fallbackConfig.minBet,
    maxBet: readString(config.maxBet) || fallbackConfig.maxBet,
    payoutTables:
      readPayoutTables(config.payoutTables) || fallbackConfig.payoutTables,
  };
}

export function readPlinkoBet(data: unknown, request: PlinkoBetRequest): Bet {
  const record = findRecordWithAnyKey(data, [
    "bucketIndex",
    "bucket_index",
    "multiplier",
    "payout",
    "results",
  ]);

  if (!record) {
    throw new Error(
      "Plinko bet response shape is unknown. Check [plinko-api] console logs.",
    );
  }

  const bucketIndex =
    readNumberField(record, ["bucketIndex", "bucket_index", "bucket", "slot"]) ??
    readBucketIndexFromResults(record.results);
  const multiplier = readNumberField(record, ["multiplier", "coefficient"]);
  const payout = readStringOrNumberField(record, ["payout", "win", "winAmount"]);

  if (bucketIndex === null || multiplier === null || payout === null) {
    throw new Error(
      "Plinko bet response is missing bucketIndex, multiplier, or payout. Check [plinko-api] console logs.",
    );
  }

  return {
    betId:
      readStringField(record, ["betId", "bet_id", "id", "roundId"]) ||
      crypto.randomUUID(),
    betSize:
      readStringOrNumberField(record, ["betSize", "bet_size", "amount"]) ||
      request.amount,
    bucketIndex,
    createdAt: readStringField(record, ["createdAt", "created_at"]) || "",
    multiplier,
    payout,
  };
}

function findRecord(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (Object.keys(record).length > 0) {
    return record;
  }

  return null;
}

function findRecordWithAnyKey(
  data: unknown,
  keys: string[],
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (keys.some((key) => key in record)) {
    return record;
  }

  for (const value of Object.values(record)) {
    const nestedRecord = findRecordWithAnyKey(value, keys);

    if (nestedRecord) {
      return nestedRecord;
    }
  }

  return null;
}

function readNumberArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "number")
    ? value
    : null;
}

function readRiskArray(value: unknown): Risk[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const risks = value.filter(isRisk);

  return risks.length === value.length ? risks : null;
}

function readPayoutTables(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const payoutTables: Partial<GameConfig["payoutTables"]> = {};

  for (const risk of ["LOW", "MEDIUM", "HIGH"] as const) {
    const riskTable = record[risk];

    if (!riskTable || typeof riskTable !== "object") {
      continue;
    }

    const rowsTable: Record<number, number[]> = {};

    Object.entries(riskTable as Record<string, unknown>).forEach(
      ([row, multipliers]) => {
        const rowNumber = Number(row);
        const multiplierArray = readNumberArray(multipliers);

        if (Number.isFinite(rowNumber) && multiplierArray) {
          rowsTable[rowNumber] = multiplierArray;
        }
      },
    );

    payoutTables[risk] = rowsTable;
  }

  return Object.keys(payoutTables).length > 0
    ? (payoutTables as GameConfig["payoutTables"])
    : null;
}

function readString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function readNumberField(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return null;
}

function readBucketIndexFromResults(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const resultValues = value.map((item) => {
    if (typeof item === "number" && Number.isFinite(item)) {
      return item;
    }

    if (typeof item === "string" && item.trim()) {
      const parsedValue = Number(item);

      return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    return null;
  });

  if (resultValues.some((item) => item === null)) {
    return null;
  }

  return resultValues.reduce<number>(
    (bucketIndex, item) => bucketIndex + (item ?? 0),
    0,
  );
}

function readStringField(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function readStringOrNumberField(
  record: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = readString(record[key]);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function isRisk(value: unknown): value is Risk {
  return value === "LOW" || value === "MEDIUM" || value === "HIGH";
}
