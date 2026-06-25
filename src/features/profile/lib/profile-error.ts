import axios from "axios";

// True when the request ultimately failed auth (after the refresh retry),
// meaning the session is dead and the user should be signed out.
export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

// Extracts the human-readable message the backend returned, falling back to a
// generic string. Handles NestJS-style `{ message: string | string[] }`.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;
    const detail = data?.message ?? data?.error;

    if (Array.isArray(detail)) {
      const joined = detail
        .filter((item): item is string => typeof item === "string")
        .join(". ");

      if (joined.trim()) {
        return joined;
      }
    }

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
