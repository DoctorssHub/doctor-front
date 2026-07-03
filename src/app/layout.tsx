import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalNavigationLoader, QueryProvider } from "@/shared";
import { AppModalsProvider } from "@/shared/providers/app-modals-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mc-queen-casino.vercel.app";
const siteDescription =
  "Step into McQueen Casino for high-energy games, rewards, and leaderboard battles made for every lucky streak.";
const previewImage = {
  url: "/img.png",
  width: 384,
  height: 466,
  alt: "McQueen Casino preview",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "McQueen Casino",
    template: "%s | McQueen Casino",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "McQueen Casino",
    description: siteDescription,
    url: "/",
    siteName: "McQueen Casino",
    images: [previewImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "McQueen Casino",
    description: siteDescription,
    images: [previewImage],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <GlobalNavigationLoader />
          {children}
          <AppModalsProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
