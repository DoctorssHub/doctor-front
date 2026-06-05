import { NextRequest } from "next/server";

const backendApiUrl = process.env.BACKEND_API_URL;

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
    headers: createForwardHeaders(request.headers),
    body: hasRequestBody(request.method) ? request.body : undefined,
    redirect: "manual",
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  return createProxyResponse(request, backendResponse);
}

function createForwardHeaders(headers: Headers) {
  const forwardedHeaders = new Headers(headers);

  for (const header of [
    "accept-encoding",
    "connection",
    "content-length",
    "host",
    "origin",
    "referer",
  ]) {
    forwardedHeaders.delete(header);
  }

  return forwardedHeaders;
}

function createProxyResponse(
  request: NextRequest,
  backendResponse: Response,
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

  if (isLocalhost(hostname)) {
    return attributes
      .filter((attribute) => !/^secure$/i.test(attribute))
      .map((attribute) =>
        /^samesite=none$/i.test(attribute) ? "SameSite=Lax" : attribute,
      )
      .join("; ");
  }

  return attributes.join("; ");
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
