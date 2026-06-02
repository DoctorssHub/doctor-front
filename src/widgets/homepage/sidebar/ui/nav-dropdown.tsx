import Image from "next/image";
import ArrowIcon from '@/assets/aside/arrow.svg'

import type { NavDropdownItem } from "../model/types";

type NavDropdownProps = {
  item: NavDropdownItem;
};

export function NavDropdown({ item }: NavDropdownProps) {
  return (
    <details
      className="group w-[195px]"
      open
    >
      <summary
        className="flex h-11 cursor-pointer list-none items-center justify-between rounded-xl px-4 
        text-[16px] font-semibold text-(--color-text-primary)  border border-(--color-surface-icon)
        
        transition hover:text-white [&::-webkit-details-marker]:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
        }}
      >
        <span className="flex items-center gap-3">
          <Image
            alt=""
            height={20}
            src={item.icon}
            width={20}
          />
          {item.title}
        </span>
        <Image
          alt=""
          height={20}
          src={ArrowIcon}
          width={20}
          className="rotate-0 transition group-open:rotate-180"
        />
       </summary>
      <div className="flex flex-col gap-1 py-3">
        {item.children.map((child) => (
          <a
            className="flex h-11 items-center gap-4 rounded-lg px-8 
            text-[16px] font-medium text-(--color-text-primary) transition hover:bg-(--color-surface-nav-hover) hover:text-white"
            href={child.href}
            key={child.title}
          >
            <Image
              alt=""
              height={20}
              src={child.icon}
              width={20}
            />
            {child.title}
          </a>
        ))}
      </div>
    </details>
  );
}
