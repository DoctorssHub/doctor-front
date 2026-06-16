import { NextRequest } from "next/server";

const backendApiUrl = process.env.BACKEND_API_URL;
const AUTH_COOKIE_NAMES = ["access_token", "refresh_token", "socket_token"];
const BACKEND_REFRESH_COOKIE_PATH = "/auth/refresh";
const PROXY_REFRESH_COOKIE_PATH = "/api/auth/refresh";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!backendApiUrl) {
    return Response.json(
      { message: "BACKEND_API_URL is not configured." },
      { status: 500 },
    );
  }

  const initialCookieHeader = createAuthCookieHeader(request);
  const currentUserResponse = await requestBackend("user/query/me", {
    cookieHeader: initialCookieHeader,
  });

  if (currentUserResponse.ok) {
    return createSessionResponse({
      authenticated: true,
      backendResponse: currentUserResponse,
      hostname: request.nextUrl.hostname,
    });
  }

  const refreshResponse = await requestBackend("auth/refresh", {
    cookieHeader: initialCookieHeader,
  });

  if (!refreshResponse.ok) {
    const response = Response.json({ authenticated: false, user: null });
    clearAuthCookies(response, request.nextUrl.hostname);

    return response;
  }

  const refreshedCookieHeader = mergeCookieHeader(
    initialCookieHeader,
    getSetCookies(refreshResponse.headers),
  );
  const refreshedUserResponse = await requestBackend("user/query/me", {
    cookieHeader: refreshedCookieHeader,
  });

  return createSessionResponse({
    authenticated: refreshedUserResponse.ok,
    backendResponse: refreshedUserResponse,
    cookieSourceResponse: refreshResponse,
    hostname: request.nextUrl.hostname,
  });
}

async function requestBackend(
  path: string,
  { cookieHeader }: { cookieHeader: string | null },
) {
  const targetUrl = new URL(path, withTrailingSlash(backendApiUrl || ""));
  const headers = new Headers();

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  return fetch(targetUrl, {
    headers,
    method: "GET",
    redirect: "manual",
  });
}

async function createSessionResponse({
  authenticated,
  backendResponse,
  cookieSourceResponse = backendResponse,
  hostname,
}: {
  authenticated: boolean;
  backendResponse: Response;
  cookieSourceResponse?: Response;
  hostname: string;
}) {
  const user = authenticated ? await readJsonResponse(backendResponse) : null;
  const response = Response.json({ authenticated, user });

  for (const cookie of getSetCookies(cookieSourceResponse.headers)) {
    response.headers.append("set-cookie", normalizeSetCookie(cookie, hostname));
  }

  if (!authenticated) {
    clearAuthCookies(response, hostname);
  }

  return response;
}

async function readJsonResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createAuthCookieHeader(request: NextRequest) {
  const cookies = AUTH_COOKIE_NAMES.flatMap((name) => {
    const value = request.cookies.get(name)?.value;

    return value ? [`${name}=${value}`] : [];
  });

  return cookies.length > 0 ? cookies.join("; ") : null;
}

function mergeCookieHeader(cookieHeader: string | null, setCookies: string[]) {
  const cookies = new Map<string, string>();

  for (const cookie of cookieHeader?.split(";") || []) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name && valueParts.length > 0) {
      cookies.set(name, valueParts.join("="));
    }
  }

  for (const cookie of setCookies) {
    const [nameValue] = cookie.split(";");
    const [name, ...valueParts] = nameValue.trim().split("=");

    if (!name || valueParts.length === 0) {
      continue;
    }

    const value = valueParts.join("=");

    if (value) {
      cookies.set(name, value);
    } else {
      cookies.delete(name);
    }
  }

  return Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; ");
}

function clearAuthCookies(response: Response, hostname: string) {
  for (const name of AUTH_COOKIE_NAMES) {
    for (const path of ["/", BACKEND_REFRESH_COOKIE_PATH, PROXY_REFRESH_COOKIE_PATH]) {
      response.headers.append(
        "set-cookie",
        createExpiredCookie(name, path, hostname),
      );
    }
  }
}

function getSetCookies(headers: Headers) {
  const headersWithCookies = headers as Headers & {
    getSetCookie?: () => string[];
  };

  const cookies = headersWithCookies.getSetCookie?.();

  if (cookies?.length) {
    return cookies;
  }

  const setCookie = headers.get("set-cookie");

  return setCookie ? splitSetCookieHeader(setCookie) : [];
}

function splitSetCookieHeader(header: string) {
  return header.split(/,(?=\s*[^;,]+=)/).map((cookie) => cookie.trim());
}

function normalizeSetCookie(cookie: string, hostname: string) {
  const attributes = cookie
    .split(";")
    .map((attribute) => attribute.trim())
    .filter((attribute) => !/^domain=/i.test(attribute));
  const [nameValue] = attributes;
  const cookieName = nameValue?.split("=")[0] || "";
  const normalizedAttributes = isAuthCookieName(cookieName)
    ? secureAuthCookieAttributes(attributes, hostname)
    : attributes;

  if (isLocalhost(hostname)) {
    return normalizedAttributes
      .filter((attribute) => !/^secure$/i.test(attribute))
      .map((attribute) =>
        /^samesite=none$/i.test(attribute) ? "SameSite=Lax" : attribute,
      )
      .join("; ");
  }

  return normalizedAttributes.join("; ");
}

function secureAuthCookieAttributes(attributes: string[], hostname: string) {
  const nextAttributes = attributes
    .filter(
      (attribute) =>
        !/^httponly$/i.test(attribute) &&
        !/^samesite=/i.test(attribute) &&
        !/^secure$/i.test(attribute),
    )
    .map(normalizeAuthCookiePathAttribute);
  const sameSite =
    attributes.find((attribute) => /^samesite=/i.test(attribute)) ||
    "SameSite=Lax";

  nextAttributes.push("HttpOnly", sameSite);

  if (!isLocalhost(hostname)) {
    nextAttributes.push("Secure");
  }

  return nextAttributes;
}

function normalizeAuthCookiePathAttribute(attribute: string) {
  if (!/^path=/i.test(attribute)) {
    return attribute;
  }

  const path = attribute.slice(attribute.indexOf("=") + 1);

  return path === BACKEND_REFRESH_COOKIE_PATH
    ? `Path=${PROXY_REFRESH_COOKIE_PATH}`
    : attribute;
}

function createExpiredCookie(name: string, path: string, hostname: string) {
  const attributes = [
    `${name}=`,
    `Path=${path}`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (!isLocalhost(hostname)) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function isAuthCookieName(name: string) {
  return AUTH_COOKIE_NAMES.includes(name);
}

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

function isLocalhost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}
