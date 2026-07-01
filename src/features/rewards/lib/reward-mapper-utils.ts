export type RawRecord = Record<string, unknown>;

export function asRecord(value: unknown): RawRecord {
  if (typeof value === "object" && value !== null) {
    return value as RawRecord;
  }

  return {};
}

export function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}
