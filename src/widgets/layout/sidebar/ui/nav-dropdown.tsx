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
  isCollapsed?: boolean;
  item: NavDropdownItem;
};

export const NavDropdown = memo(function NavDropdown({
  isCollapsed = false,
  item,
}: NavDropdownProps) {
  return (
    <details
      className="group w-full"
      open
    >
      <summary
        aria-label={isCollapsed ? item.title : undefined}
        className={`flex h-11 cursor-pointer list-none items-center rounded-xl text-[16px] font-semibold text-(--color-text-primary) ${sidebarNavHoverClass} [&::-webkit-details-marker]:hidden ${
          isCollapsed ? "justify-center px-0" : "justify-between px-4"
        }`}
        style={{
          backgroundImage: "var(--gradient-nav-item)",
        }}
      >
        <span className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
          <Image
            alt={`${item.title} menu`}
            className={sidebarNavIconHoverClass}
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
              onClick={(event) => event.stopPropagation()}
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
        {item.children.map((child) => (
          <a
            aria-label={isCollapsed ? child.title : undefined}
            className={`flex h-11 items-center rounded-lg text-[16px] font-medium text-(--color-text-primary) ${sidebarGameNavHoverClass} ${
              isCollapsed ? "justify-center px-0" : "gap-4 px-8"
            }`}
            href={child.href}
            key={child.title}
          >
            <Image
              alt={child.title}
              className={sidebarGameNavIconHoverClass}
              height={20}
              src={child.icon}
              width={20}
            />
            <span className={isCollapsed ? "sr-only" : ""}>{child.title}</span>
          </a>
        ))}
      </div>
    </details>
  );
});
