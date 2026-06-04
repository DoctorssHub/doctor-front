import type { NextConfig } from "next";

// Server-side target for the dev proxy. The browser calls the same-origin
// `/api/*` path (see NEXT_PUBLIC_API_URL), and Next.js rewrites it to the real
// backend server-to-server, which avoids browser CORS preflight in development.
const backendApiUrl = process.env.BACKEND_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendApiUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
