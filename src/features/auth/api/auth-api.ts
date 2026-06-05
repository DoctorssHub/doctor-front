import axios from "axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
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

export function getCurrentUser() {
  return authClient.get<MeResponse>("/user/query/me");
}

export function forgotPassword(payload: ForgotPasswordRequest) {
  return authClient.post<ForgotPasswordResponse>(
    "/auth/local/forgot-password",
    payload,
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
