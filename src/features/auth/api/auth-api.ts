import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
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
  SessionResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth-types";

const authClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const authRequestIds = new WeakMap<InternalAxiosRequestConfig, number>();
const SENSITIVE_FIELD_PATTERN =
  /password|token|authorization|cookie|recaptcha|captcha|secret/i;

let refreshRequest: Promise<unknown> | null = null;

if (process.env.NODE_ENV !== "production") {
  authClient.interceptors.request.use((config) => {
    const requestId = nextAuthRequestId();
    authRequestIds.set(config, requestId);

    console.groupCollapsed(
      `[auth-api] -> ${formatRequestMethod(config.method)} ${config.url} #${requestId}`,
    );
    console.log({
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      params: redactValue(config.params),
      headers: redactHeaders(config.headers),
      data: redactValue(config.data),
    });
    console.groupEnd();

    return config;
  });

  authClient.interceptors.response.use(
    (response) => {
      logAuthResponse(response);

      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          logAuthResponse(error.response, true);
        } else {
          console.error("[auth-api] request failed before response", {
            message: error.message,
            code: error.code,
            config: {
              baseURL: error.config?.baseURL,
              url: error.config?.url,
              method: error.config?.method,
              params: redactValue(error.config?.params),
              headers: redactHeaders(error.config?.headers),
              data: redactValue(error.config?.data),
            },
          });
        }
      }

      return Promise.reject(error);
    },
  );
}

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

export function getCurrentSession() {
  return authClient.get<SessionResponse>("/auth/refresh/session");
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
  return authClient.get<RefreshResponse>("/auth/refresh");
}

function isUnauthorizedAxiosError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function nextAuthRequestId() {
  return authRequestIdsCounter++;
}

let authRequestIdsCounter = 1;

function logAuthResponse(response: AxiosResponse, isError = false) {
  const requestId = authRequestIds.get(response.config);
  const method = formatRequestMethod(response.config.method);
  const label = `[auth-api] <- ${response.status} ${method} ${response.config.url}${
    requestId ? ` #${requestId}` : ""
  }`;
  const payload = {
    status: response.status,
    statusText: response.statusText,
    headers: redactHeaders(response.headers),
    data: redactValue(response.data),
  };

  if (isError) {
    console.groupCollapsed(label);
    console.error(payload);
    console.groupEnd();
    return;
  }

  console.groupCollapsed(label);
  console.log(payload);
  console.groupEnd();
}

function formatRequestMethod(method: string | undefined) {
  return (method || "GET").toUpperCase();
}

function redactHeaders(headers: unknown) {
  if (!headers) {
    return undefined;
  }

  if (
    typeof headers === "object" &&
    "toJSON" in headers &&
    typeof headers.toJSON === "function"
  ) {
    return redactValue(headers.toJSON() as RawAxiosRequestHeaders);
  }

  return redactValue(headers);
}

function redactValue(value: unknown, depth = 0): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (depth > 5) {
    return "[Max depth]";
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, depth + 1));
  }

  if (typeof FormData !== "undefined" && value instanceof FormData) {
    return Array.from(value.entries()).reduce<Record<string, unknown>>(
      (result, [key, entryValue]) => {
        result[key] = SENSITIVE_FIELD_PATTERN.test(key)
          ? "[redacted]"
          : redactValue(entryValue, depth + 1);

        return result;
      },
      {},
    );
  }

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((result, [key, entryValue]) => {
    result[key] = SENSITIVE_FIELD_PATTERN.test(key)
      ? "[redacted]"
      : redactValue(entryValue, depth + 1);

    return result;
  }, {});
}
