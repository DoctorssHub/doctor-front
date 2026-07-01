import Image from "next/image";

import type { NavLinkItem } from "../model/types";
import { sidebarNavHoverClass, sidebarNavIconHoverClass } from "./nav-hover";

type NavLinkProps = {
  iconSize: number;
  isCollapsed?: boolean;
  item: NavLinkItem;
};

export function NavLink({ iconSize, isCollapsed = false, item }: NavLinkProps) {
  return (
    <a
      aria-label={isCollapsed ? item.title : undefined}
      className={`flex h-11 w-full items-center rounded-lg py-3 text-[16px] font-medium text-(--color-text-primary) ${sidebarNavHoverClass} ${
        isCollapsed ? "justify-center px-0" : "gap-2 px-3.5"
      }`}
      href={item.href}
      style={{ backgroundImage: "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)" }}
    >
      <Image
        alt={item.title}
        className={sidebarNavIconHoverClass}
        height={iconSize}
        src={item.icon}
        width={iconSize}
      />
      <span className={isCollapsed ? "sr-only" : ""}>{item.title}</span>
    </a>
  );
}
