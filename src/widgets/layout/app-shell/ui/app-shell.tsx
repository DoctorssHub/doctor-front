"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Footer } from "@/widgets/layout/footer";
import { HomeHeader } from "@/widgets/layout/header";
import { Sidebar } from "@/widgets/layout/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
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
      <div className="desktop:flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        />
        <div
          className={`min-w-0 flex-1 pt-16 transition-[margin] duration-300 ${
            isSidebarCollapsed ? "desktop:ml-[84px]" : "desktop:ml-[227px]"
          }`}
        >
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
