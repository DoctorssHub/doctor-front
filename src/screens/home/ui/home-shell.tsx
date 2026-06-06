"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { HomeHeader, Sidebar } from "@/widgets/layout";

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({ children }: HomeShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        />
        <div
          className={`min-w-0 flex-1 pt-16 transition-[margin] duration-300 ${
            isSidebarCollapsed
              ? "min-[1280px]:ml-[84px]"
              : "min-[1280px]:ml-[227px]"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
