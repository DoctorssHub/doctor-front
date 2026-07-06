import Image from "next/image";
import { memo } from "react";

import type { NavLinkItem } from "../model/types";
import { sidebarNavHoverClass, sidebarNavIconHoverClass } from "./nav-hover";

type NavLinkProps = {
  iconSize: number;
  isActive?: boolean;
  isCollapsed?: boolean;
  item: NavLinkItem;
  onNavigate?: () => void;
};

export const NavLink = memo(function NavLink({
  iconSize,
  isActive = false,
  isCollapsed = false,
  item,
  onNavigate,
}: NavLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-label={isCollapsed ? item.title : undefined}
      className={`flex h-11 w-full items-center rounded-lg py-3 text-[16px] font-medium ${isActive ? "border-(--color-brand) text-white shadow-[0_10px_26px_rgb(0_0_0_/_24%),0_0_16px_rgb(200_40_49_/_18%)] before:opacity-100 after:opacity-100" : "text-(--color-text-primary)"} ${sidebarNavHoverClass} ${
        isCollapsed ? "justify-center px-0" : "gap-2 px-3.5"
      }`}
      href={item.href}
      style={{ backgroundImage: "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)" }}
      onClick={onNavigate}
    >
      <Image
        alt={item.title}
        className={`${sidebarNavIconHoverClass} ${isActive ? "brightness-125" : ""}`}
        height={iconSize}
        src={item.icon}
        width={iconSize}
      />
      <span className={isCollapsed ? "sr-only" : ""}>{item.title}</span>
    </a>
  );
});
