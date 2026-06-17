import axios from "axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth-types";

const authClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let refreshRequest: Promise<unknown> | null = null;

export function registerUser(payload: RegisterRequest, recaptchaToken: string) {
  return authClient.post<RegisterResponse>("/auth/local/register", payload, {
    headers: { "recaptcha-token": recaptchaToken },
  });
}

export function verifyEmail(payload: VerifyEmailRequest) {
  return authClient.post<VerifyEmailResponse>(
    "/auth/local/verify-email",
    payload,
  );
}

export function loginUser(payload: LoginRequest, recaptchaToken: string) {
  return authClient.post<LoginResponse>("/auth/local/login", payload, {
    headers: { "recaptcha-token": recaptchaToken },
  });
}

export async function getCurrentUser() {
  try {
    return await authClient.get<MeResponse>("/user/query/me");
  } catch (error) {
    if (!isUnauthorizedAxiosError(error)) {
      throw error;
    }

    await refreshSession();

    return authClient.get<MeResponse>("/user/query/me");
  }
}

export function refreshSession() {
  refreshRequest ??= requestRefreshSession().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

export function forgotPassword(
  payload: ForgotPasswordRequest,
  recaptchaToken: string,
) {
  return authClient.post<ForgotPasswordResponse>(
    "/auth/local/forgot-password",
    payload,
    {
      headers: { "recaptcha-token": recaptchaToken },
    },
  );
}

export function resetPassword(payload: ResetPasswordRequest) {
  return authClient.post<ResetPasswordResponse>(
    "/auth/local/reset-password",
    payload,
  );
}

export function logoutUser() {
  return authClient.get<LogoutResponse>("/auth/logout");
}

async function requestRefreshSession() {
  try {
    return await authClient.post<RefreshResponse>("/auth/refresh");
  } catch (error) {
    if (!isMethodUnsupportedAxiosError(error)) {
      throw error;
    }

    return authClient.get<RefreshResponse>("/auth/refresh");
  }
}

function isUnauthorizedAxiosError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function isMethodUnsupportedAxiosError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    (error.response?.status === 404 || error.response?.status === 405)
  );
}
