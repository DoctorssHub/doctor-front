import Image from "next/image";

import type { NavLinkItem } from "../model/types";

type NavLinkProps = {
  iconSize: number;
  item: NavLinkItem;
};

export function NavLink({ iconSize, item }: NavLinkProps) {
  return (
    <a
      className="flex h-11 w-full items-center gap-2 rounded-lg px-3.5 py-3  border border-(--color-surface-icon)
      text-[16px] font-medium text-(--color-text-primary) transition hover:text-white 
      "
      href={item.href}
      style={{ backgroundImage: "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)" }}
    >
      <Image alt={item.title} height={iconSize} src={item.icon} width={iconSize} />
      {item.title}
    </a>
  );
}
