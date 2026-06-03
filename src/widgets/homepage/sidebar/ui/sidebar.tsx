"use client";

import { useState } from "react";
import Image from "next/image";

import { navItems } from "../model/nav-items";
import { ClaimCard } from "./claim-card";
import { NavDropdown } from "./nav-dropdown";
import { NavLink } from "./nav-link";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative hidden shrink-0 border-r border-(--color-border-sidebar) bg-(--color-surface)/95 backdrop-blur transition-[width] duration-300 lg:sticky lg:top-16 lg:z-20 lg:flex lg:h-[calc(100vh-4rem)] ${
        isCollapsed ? "lg:w-[84px] px-3" : "lg:w-[227px] px-4"
      }`}
    >
      <button
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
        className="absolute -right-16 top-6 z-30 flex size-10 cursor-pointer items-center justify-center 
        rounded-lg border border-(--color-border-sidebar) 
        bg-(--color-surface-elevated) shadow-[0_0_24px_rgb(0_0_0/35%)] transition 
        hover:border-(--color-border-control) hover:bg-(--color-surface-hover)"
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
  );
}
