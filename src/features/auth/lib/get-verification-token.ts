function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readStringField(
  source: Record<string, unknown>,
  fieldName: string,
): string | null {
  const value = source[fieldName];

  return typeof value === "string" && value.length > 0 ? value : null;
}

export function getVerificationToken(data: unknown): string | null {
  if (!isRecord(data)) {
    return null;
  }

  const directToken =
    readStringField(data, "verificationToken") ||
    readStringField(data, "verification_token") ||
    readStringField(data, "token");

  if (directToken) {
    return directToken;
  }

  const nestedData = data.data;

  if (isRecord(nestedData)) {
    return (
      readStringField(nestedData, "verificationToken") ||
      readStringField(nestedData, "verification_token") ||
      readStringField(nestedData, "token")
    );
  }

  return null;
}
