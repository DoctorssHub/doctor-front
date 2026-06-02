import Image from "next/image";

import type { NavDropdownItem } from "../model/types";

type NavDropdownProps = {
  item: NavDropdownItem;
};

export function NavDropdown({ item }: NavDropdownProps) {
  return (
    <details className="group w-[195px]" open>
      <summary
        className="flex h-[56px] cursor-pointer list-none items-center justify-between rounded-xl px-4 text-[20px] font-semibold text-(--color-text-primary) shadow-(--shadow-nav-active) transition hover:text-white [&::-webkit-details-marker]:hidden"
        style={{ backgroundImage: "var(--gradient-nav-item)" }}
      >
        <span className="flex items-center gap-3">
          <Image alt="" height={28} src={item.icon} width={28} />
          {item.title}
        </span>
        <span className="size-0 rotate-180 border-x-[9px] border-b-[10px] border-x-transparent border-b-(--color-text-muted) transition group-open:rotate-0" />
      </summary>
      <div className="flex flex-col gap-1 py-3">
        {item.children.map((child) => (
          <a
            className="flex h-[48px] items-center gap-4 rounded-lg px-8 text-[20px] font-semibold text-(--color-text-primary) transition hover:bg-(--color-surface-nav-hover) hover:text-white"
            href={child.href}
            key={child.title}
          >
            <Image alt="" height={28} src={child.icon} width={28} />
            {child.title}
          </a>
        ))}
      </div>
    </details>
  );
}
