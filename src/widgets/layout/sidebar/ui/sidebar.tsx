"use client";

import Image from "next/image";

import { navItems } from "../model/nav-items";
import { ClaimCard } from "./claim-card";
import { NavDropdown } from "./nav-dropdown";
import { NavLink } from "./nav-link";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";
import HelpIcon from "@/assets/aside/helpIcon.svg";

type SidebarProps = {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onToggleCollapse?: () => void;
};

export function Sidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-x-0 bottom-0 top-16 z-90 cursor-default bg-black/50 desktop:hidden"
          onClick={onMobileClose}
          type="button"
        />
      ) : null}
      <aside
        className={`fixed left-0 top-16 z-90 flex h-[calc(100vh-4rem)] w-[227px] shrink-0 border-r border-(--color-border-sidebar) bg-(--color-surface)/95 px-4 backdrop-blur transition-transform duration-300 max-desktop:overflow-y-auto max-tablet:w-full desktop:z-20 desktop:translate-x-0 desktop:transition-[width] ${
          isMobileOpen ? "max-desktop:translate-x-0" : "max-desktop:-translate-x-full"
        } ${isCollapsed ? "desktop:w-[84px] desktop:px-3" : "desktop:w-[227px] desktop:px-3"}`}
      >
        <button
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
          className="absolute -right-16 top-6 z-30 hidden size-10 cursor-pointer items-center justify-center rounded-lg border border-(--color-border-sidebar) bg-(--color-surface-elevated) shadow-[0_0_24px_rgb(0_0_0/35%)] transition hover:border-(--color-border-control) hover:bg-(--color-surface-hover) desktop:flex"
          onClick={onToggleCollapse}
          type="button"
        >
          <Image
            alt={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          <a
            aria-label={isCollapsed ? "Help & Support" : undefined}
            className={`-mx-4 mt-auto flex h-20 w-[calc(100%+32px)] items-center border-t border-[#1b1f26] p-4 text-[18px] font-semibold text-(--color-text-primary) transition hover:bg-(--color-surface-hover) ${
              isCollapsed ? "justify-center" : "justify-center gap-4"
            }`}
            href="#"
          >
            <Image
              alt="Help and support"
              height={16}
              src={HelpIcon}
              width={16}
            />
            <span className={isCollapsed ? "sr-only" : ""}>
              Help & Support
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
