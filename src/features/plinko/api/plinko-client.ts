import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { refreshSession } from "@/features/auth/api/auth-api";

export const plinkoClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const plinkoRequestIds = new WeakMap<InternalAxiosRequestConfig, number>();
let plinkoRequestIdsCounter = 1;

if (process.env.NODE_ENV !== "production") {
  plinkoClient.interceptors.request.use((config) => {
    const requestId = nextPlinkoRequestId();
    plinkoRequestIds.set(config, requestId);

    console.groupCollapsed(
      `[plinko-api] -> ${formatRequestMethod(config.method)} ${config.url} #${requestId}`,
    );
    console.log({
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      params: config.params,
      headers: normalizeHeaders(config.headers),
      data: config.data,
    });
    console.groupEnd();

    return config;
  });

  plinkoClient.interceptors.response.use(
    (response) => {
      logPlinkoResponse(response);

      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          logPlinkoResponse(error.response, true);
        } else {
          console.error("[plinko-api] request failed before response", {
            message: error.message,
            code: error.code,
            config: {
              baseURL: error.config?.baseURL,
              url: error.config?.url,
              method: error.config?.method,
              params: error.config?.params,
              headers: normalizeHeaders(error.config?.headers),
              data: error.config?.data,
            },
          });
        }
      }

      return Promise.reject(error);
    },
  );
}

export async function requestWithAuthRetry<T>(
  request: () => Promise<AxiosResponse<T>>,
) {
  try {
    return await request();
  } catch (error) {
    if (!isUnauthorizedAxiosError(error)) {
      throw error;
    }

    await refreshSession();

    return request();
  }
}

function isUnauthorizedAxiosError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function nextPlinkoRequestId() {
  return plinkoRequestIdsCounter++;
}

function logPlinkoResponse(response: AxiosResponse, isError = false) {
  const requestId = plinkoRequestIds.get(response.config);
  const method = formatRequestMethod(response.config.method);
  const label = `[plinko-api] <- ${response.status} ${method} ${response.config.url}${
    requestId ? ` #${requestId}` : ""
  }`;
  const payload = {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeHeaders(response.headers),
    data: response.data,
  };

  console.groupCollapsed(label);

  if (isError) {
    console.error(payload);
  } else {
    console.log(payload);
  }

  console.groupEnd();
}

function formatRequestMethod(method: string | undefined) {
  return (method || "GET").toUpperCase();
}

function normalizeHeaders(headers: unknown) {
  if (!headers) {
    return undefined;
  }

  if (
    typeof headers === "object" &&
    "toJSON" in headers &&
    typeof headers.toJSON === "function"
  ) {
    return headers.toJSON() as RawAxiosRequestHeaders;
  }

  return headers;
}
