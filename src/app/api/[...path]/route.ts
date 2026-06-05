import { NextRequest } from "next/server";

const backendApiUrl = process.env.BACKEND_API_URL;
const AUTH_COOKIE_NAMES = ["access_token", "refresh_token", "socket_token"];

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request: NextRequest, context: ProxyContext) {
  return proxyRequest(request, context);
}

async function proxyRequest(request: NextRequest, context: ProxyContext) {
  if (!backendApiUrl) {
    return Response.json(
      { message: "BACKEND_API_URL is not configured." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const targetUrl = new URL(path.join("/"), withTrailingSlash(backendApiUrl));
  targetUrl.search = request.nextUrl.search;

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers: createForwardHeaders(request),
    body: hasRequestBody(request.method) ? request.body : undefined,
    redirect: "manual",
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  return createProxyResponse(request, backendResponse, path);
}

function createForwardHeaders(request: NextRequest) {
  const forwardedHeaders = new Headers(request.headers);

  for (const header of [
    "accept-encoding",
    "connection",
    "content-length",
    "cookie",
    "host",
    "origin",
    "referer",
  ]) {
    forwardedHeaders.delete(header);
  }

  const authCookieHeader = createAuthCookieHeader(request);

  if (authCookieHeader) {
    forwardedHeaders.set("cookie", authCookieHeader);
  }

  return forwardedHeaders;
}

function createProxyResponse(
  request: NextRequest,
  backendResponse: Response,
  path: string[],
) {
  const responseHeaders = new Headers();

  backendResponse.headers.forEach((value, key) => {
    if (shouldForwardResponseHeader(key)) {
      responseHeaders.set(key, value);
    }
  });

  const response = new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });

  for (const cookie of getSetCookies(backendResponse.headers)) {
    response.headers.append(
      "set-cookie",
      normalizeSetCookie(cookie, request.nextUrl.hostname),
    );
  }

  if (isLogoutPath(path)) {
    clearAuthCookies(response, request.nextUrl.hostname);
  }

  return response;
}

function shouldForwardResponseHeader(header: string) {
  return ![
    "connection",
    "content-encoding",
    "content-length",
    "set-cookie",
    "transfer-encoding",
  ].includes(header.toLowerCase());
}

function createAuthCookieHeader(request: NextRequest) {
  const cookies = AUTH_COOKIE_NAMES.flatMap((name) => {
    const value = request.cookies.get(name)?.value;

    return value ? [`${name}=${value}`] : [];
  });

  return cookies.length > 0 ? cookies.join("; ") : null;
}

function clearAuthCookies(response: Response, hostname: string) {
  for (const name of AUTH_COOKIE_NAMES) {
    for (const path of ["/", "/auth/refresh"]) {
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
  const nextAttributes = attributes.filter(
    (attribute) =>
      !/^httponly$/i.test(attribute) &&
      !/^samesite=/i.test(attribute) &&
      !/^secure$/i.test(attribute),
  );
  const sameSite =
    attributes.find((attribute) => /^samesite=/i.test(attribute)) ||
    "SameSite=Lax";

  nextAttributes.push("HttpOnly", sameSite);

  if (!isLocalhost(hostname)) {
    nextAttributes.push("Secure");
  }

  return nextAttributes;
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

function isLogoutPath(path: string[]) {
  return path.join("/") === "auth/logout";
}

function hasRequestBody(method: string) {
  return !["GET", "HEAD"].includes(method.toUpperCase());
}

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

function isLocalhost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}
