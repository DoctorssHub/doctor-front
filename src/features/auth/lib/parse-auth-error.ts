import axios from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map(readMessage)
      .filter((message): message is string => Boolean(message));

    return messages.length > 0 ? messages.join(", ") : null;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const field of ["message", "error", "detail", "title"]) {
    const message = readMessage(value[field]);

    if (message) {
      return message;
    }
  }

  return readMessage(value.data) || readMessage(value.errors);
}

export function parseAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  const message = readMessage(error.response?.data);

  if (message) {
    return message;
  }

  return error.message || "Something went wrong. Please try again.";
}
