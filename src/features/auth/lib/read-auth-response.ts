export function readUsername(data: unknown) {
  return findUsername(data);
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
