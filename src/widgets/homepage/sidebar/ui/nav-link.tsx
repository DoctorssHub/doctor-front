import Image from "next/image";

import type { NavLinkItem } from "../model/types";

type NavLinkProps = {
  iconSize: number;
  item: NavLinkItem;
};

export function NavLink({ iconSize, item }: NavLinkProps) {
  return (
    <a
      className="flex h-[44px] w-[195px] items-center gap-2 rounded-lg px-4 py-3 text-[16px] font-medium text-(--color-text-primary) transition hover:text-white"
      href={item.href}
      style={{ backgroundImage: "var(--gradient-nav-item)" }}
    >
      <Image alt={item.title} height={iconSize} src={item.icon} width={iconSize} />
      {item.title}
    </a>
  );
}
