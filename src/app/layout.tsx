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
  title: "The Doctor",
  description: "The Doctor rewards, games, and leaderboard page.",
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
