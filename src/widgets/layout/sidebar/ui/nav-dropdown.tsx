"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import ArrowIcon from "@/assets/aside/arrow.svg";

import type { NavDropdownItem } from "../model/types";
import {
  sidebarGameNavHoverClass,
  sidebarGameNavIconHoverClass,
  sidebarNavHoverClass,
  sidebarNavIconHoverClass,
} from "./nav-hover";

type NavDropdownProps = {
  activeHref?: string | null;
  isActive?: boolean;
  isCollapsed?: boolean;
  item: NavDropdownItem;
  onNavigate?: () => void;
};

export const NavDropdown = memo(function NavDropdown({
  activeHref = null,
  isActive = false,
  isCollapsed = false,
  item,
  onNavigate,
}: NavDropdownProps) {
  return (
    <details
      className="group w-full"
      open
    >
      <summary
        aria-label={isCollapsed ? item.title : undefined}
        className={`flex h-11 cursor-pointer list-none items-center rounded-xl text-[16px] font-semibold ${isActive ? "border-(--color-brand) text-white shadow-[0_10px_26px_rgb(0_0_0_/_24%),0_0_16px_rgb(200_40_49_/_18%)] before:opacity-100 after:opacity-100" : "text-(--color-text-primary)"} ${sidebarNavHoverClass} [&::-webkit-details-marker]:hidden ${
          isCollapsed ? "justify-center px-0" : "justify-between px-4"
        }`}
        style={{
          backgroundImage: "var(--gradient-nav-item)",
        }}
      >
        <span className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
          <Image
            alt={`${item.title} menu`}
            className={`${sidebarNavIconHoverClass} ${isActive ? "brightness-125" : ""}`}
            height={20}
            src={item.icon}
            width={20}
          />
          {isCollapsed ? (
            <span className="sr-only">{item.title}</span>
          ) : (
            <Link
              className="transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/sidebar-nav:text-white"
              href={item.href}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.();
              }}
            >
              {item.title}
            </Link>
          )}
        </span>
        {!isCollapsed ? (
          <Image
            alt={`${item.title} dropdown arrow`}
            className="rotate-0 transition duration-300 group-open:rotate-180 group-hover/sidebar-nav:brightness-125"
            height={20}
            src={ArrowIcon}
            width={20}
          />
        ) : null}
      </summary>
      <div className="flex flex-col gap-1 py-3">
        {item.children.map((child) => {
          const isChildActive = activeHref === child.href;

          return (
            <a
              aria-current={isChildActive ? "page" : undefined}
              aria-label={isCollapsed ? child.title : undefined}
              className={`flex h-11 items-center rounded-lg text-[16px] font-medium ${isChildActive ? "border-(--color-border-control) bg-(--color-surface-nav-hover) text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_5%),0_8px_18px_rgb(0_0_0_/_18%)] before:opacity-100 after:opacity-100" : "text-(--color-text-primary)"} ${sidebarGameNavHoverClass} ${
                isCollapsed ? "justify-center px-0" : "gap-4 px-8"
              }`}
              href={child.href}
              key={child.title}
              onClick={onNavigate}
            >
              <Image
                alt={child.title}
                className={`${sidebarGameNavIconHoverClass} ${isChildActive ? "brightness-125" : ""}`}
                height={20}
                src={child.icon}
                width={20}
              />
              <span className={isCollapsed ? "sr-only" : ""}>{child.title}</span>
            </a>
          );
        })}
      </div>
    </details>
  );
});
