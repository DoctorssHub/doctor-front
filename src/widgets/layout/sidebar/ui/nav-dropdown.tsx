import Image from "next/image";
import ArrowIcon from "@/assets/aside/arrow.svg";

import type { NavDropdownItem } from "../model/types";

type NavDropdownProps = {
  isCollapsed?: boolean;
  item: NavDropdownItem;
};

export function NavDropdown({ isCollapsed = false, item }: NavDropdownProps) {
  return (
    <details
      className="group w-full"
      open
    >
      <summary
        aria-label={isCollapsed ? item.title : undefined}
        className={`flex h-11 cursor-pointer list-none items-center rounded-xl border border-(--color-surface-icon) text-[16px] font-semibold text-(--color-text-primary) transition hover:text-white [&::-webkit-details-marker]:hidden ${
          isCollapsed ? "justify-center px-0" : "justify-between px-4"
        }`}
        style={{
          backgroundImage: "var(--gradient-nav-item)",
        }}
      >
        <span className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
          <Image
            alt={`${item.title} menu`}
            height={20}
            src={item.icon}
            width={20}
          />
          <span className={isCollapsed ? "sr-only" : ""}>{item.title}</span>
        </span>
        {!isCollapsed ? (
          <Image
            alt={`${item.title} dropdown arrow`}
            height={20}
            src={ArrowIcon}
            width={20}
            className="rotate-0 transition group-open:rotate-180"
          />
        ) : null}
      </summary>
      <div className="flex flex-col gap-1 py-3">
        {item.children.map((child) => (
          <a
            aria-label={isCollapsed ? child.title : undefined}
            className={`flex h-11 items-center rounded-lg text-[16px] font-medium text-(--color-text-primary) transition hover:bg-(--color-surface-nav-hover) hover:text-white ${
              isCollapsed ? "justify-center px-0" : "gap-4 px-8"
            }`}
            href={child.href}
            key={child.title}
          >
            <Image
              alt={child.title}
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
}
