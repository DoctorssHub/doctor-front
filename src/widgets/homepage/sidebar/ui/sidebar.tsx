"use client";

import { useState } from "react";
import Image from "next/image";

import { navItems } from "../model/nav-items";
import { ClaimCard } from "./claim-card";
import { NavDropdown } from "./nav-dropdown";
import { NavLink } from "./nav-link";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";

type SidebarProps = {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {isMobileOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-x-0 bottom-0 top-16 z-30 cursor-default bg-black/50 min-[1280px]:hidden"
          onClick={onMobileClose}
          type="button"
        />
      ) : null}
      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[227px] shrink-0 border-r border-(--color-border-sidebar) bg-(--color-surface)/95 px-4 backdrop-blur transition-transform duration-300 max-[1279px]:overflow-y-auto max-[767px]:w-full min-[1280px]:sticky min-[1280px]:z-20 min-[1280px]:translate-x-0 min-[1280px]:transition-[width] ${
          isMobileOpen ? "max-[1279px]:translate-x-0" : "max-[1279px]:-translate-x-full"
        } ${isCollapsed ? "min-[1280px]:w-[84px] min-[1280px]:px-3" : "min-[1280px]:w-[227px] min-[1280px]:px-4"}`}
      >
      <button
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
        className="absolute -right-16 top-6 z-30 hidden size-10 cursor-pointer items-center justify-center 
        rounded-lg border border-(--color-border-sidebar) 
        bg-(--color-surface-elevated) shadow-[0_0_24px_rgb(0_0_0/35%)] transition 
        hover:border-(--color-border-control) hover:bg-(--color-surface-hover) min-[1280px]:flex"
        onClick={() => setIsCollapsed((current) => !current)}
        type="button"
      >
        <Image
          alt=""
          className={`absolute transition-opacity duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
          height={20}
          src={ArrowIcon}
          width={20}
        />
      </button>
      <div className="flex h-full w-full flex-col items-center justify-start gap-3 pt-3">
        <ClaimCard isCollapsed={isCollapsed} />
        <nav className="flex w-full flex-col gap-1">
          {navItems.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown
                isCollapsed={isCollapsed}
                item={item}
                key={item.title}
              />
            ) : (
              <NavLink
                iconSize={20}
                isCollapsed={isCollapsed}
                item={item}
                key={item.title}
              />
            ),
          )}
        </nav>
      </div>
      </aside>
    </>
  );
}
