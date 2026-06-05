export function readUsername(data: unknown) {
  return findStringByKeys(data, ["username", "userName"]);
}

export function readAccessToken(data: unknown) {
  return findStringByKeys(data, [
    "accessToken",
    "access_token",
    "access",
    "token",
    "jwt",
  ]);
}

function findStringByKeys(data: unknown, keys: string[]): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim() && !value.includes("@")) {
      return value.trim();
    }
  }

  for (const value of Object.values(record)) {
    const nestedValue = findStringByKeys(value, keys);

    if (nestedValue) {
      return nestedValue;
    }
  }

  return null;
}
