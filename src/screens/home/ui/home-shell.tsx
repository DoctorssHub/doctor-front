"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { HomeHeader, Sidebar } from "@/widgets/layout";

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({ children }: HomeShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <>
      <HomeHeader
        isSidebarOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen((current) => !current)}
      />
      <div className="min-[1280px]:flex">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
