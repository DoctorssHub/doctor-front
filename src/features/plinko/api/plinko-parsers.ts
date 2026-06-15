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
    payoutTables: mergePayoutTables(
      readPayoutTables(config.payoutTables),
      fallbackConfig.payoutTables,
    ),
  };
}

// Backend may send a partial payout table (only some risks, or some rows). The
// UI reads payoutTables[risk][rows] directly, so any gap would crash the board.
// Fill every gap from the fallback config; backend values still take precedence.
function mergePayoutTables(
  parsed: GameConfig["payoutTables"] | null,
  fallback: GameConfig["payoutTables"],
): GameConfig["payoutTables"] {
  if (!parsed) {
    return fallback;
  }

  const merged = {} as GameConfig["payoutTables"];

  for (const risk of ["LOW", "MEDIUM", "HIGH"] as const) {
    merged[risk] = { ...fallback[risk], ...parsed[risk] };
  }

  return merged;
}

export function readPlinkoBet(
  data: unknown,
  request: PlinkoBetRequest,
): Bet {
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

  // The bucket is the sum of the 0|1 path the backend returns, which is always a
  // valid integer in 0..rows. Fall back to an explicit (and validated) bucket
  // field only if the path is absent. The multiplier/payout are taken from the
  // backend as-is — the backend is the source of truth for the payout.
  const bucketIndex =
    readBucketIndexFromResults(record.results, request.rows) ??
    readBucketIndexField(record, request.rows);
  const multiplier = readNumberField(record, ["multiplier", "coefficient"]);
  const payout = readStringOrNumberField(record, ["payout", "win", "winAmount"]);

  if (bucketIndex === null || multiplier === null || payout === null) {
    throw new Error(
      "Plinko bet response is missing a valid bucketIndex/path, multiplier, or payout. Check [plinko-api] console logs.",
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

// A Plinko result is a binary path: `rows` steps of 0 (left) or 1 (right). The
// bucket is the number of right steps. Anything that is not exactly that shape
// is not a valid Plinko path, so we reject it (null) rather than guess a bucket.
function readBucketIndexFromResults(value: unknown, rows: number) {
  if (!Array.isArray(value) || value.length !== rows) {
    return null;
  }

  let bucketIndex = 0;

  for (const step of value) {
    if (step !== 0 && step !== 1) {
      return null;
    }

    bucketIndex += step;
  }

  return bucketIndex;
}

// Explicit bucket field fallback, only accepted as an integer within 0..rows.
function readBucketIndexField(record: Record<string, unknown>, rows: number) {
  const value = readNumberField(record, [
    "bucketIndex",
    "bucket_index",
    "bucket",
    "slot",
  ]);

  if (value === null || !Number.isInteger(value) || value < 0 || value > rows) {
    return null;
  }

  return value;
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
