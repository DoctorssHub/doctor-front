import type { ReactNode } from "react";
import { AppShell } from "@/widgets/layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
