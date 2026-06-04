import type { AxiosError, AxiosResponse } from "axios";

type AuthEndpoint =
  | "register"
  | "verify-email"
  | "login"
  | "forgot-password"
  | "reset-password";

export function logAuthSuccess(
  endpoint: AuthEndpoint,
  response: AxiosResponse<unknown>,
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(`[auth/${endpoint}] response`, {
    status: response.status,
    data: response.data,
  });
}

export function logAuthError(endpoint: AuthEndpoint, error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const axiosError = error as AxiosError;

  console.error(`[auth/${endpoint}] error`, {
    status: axiosError.response?.status,
    data: axiosError.response?.data,
    message: axiosError.message,
  });
}
