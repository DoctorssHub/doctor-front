import type { StaticImageData } from "next/image";

export type NavLinkItem = {
  href: string;
  icon: StaticImageData;
  title: string;
  type: "link";
};

export type NavDropdownItem = {
  children: NavLinkItem[];
  icon: StaticImageData;
  title: string;
  type: "dropdown";
};

export type NavItem = NavLinkItem | NavDropdownItem;
