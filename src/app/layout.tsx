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

export const metadata: Metadata = {
  title: {
    default: "McQueen Casino",
    template: "%s | McQueen Casino",
  },
  description: "McQueen Casino rewards, games, and leaderboard page.",
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
