import Image from "next/image";
import Link from "next/link";
import BurgerMenuIcon from "@/assets/header/burgerMenu.svg";
import { HeaderAuthButton } from "./header-auth-button";
import mcqueenLogo from "@/assets/brand/mcqueen-logo.png";

type HomeHeaderProps = {
  isSidebarOpen?: boolean;
  onMenuClick?: () => void;
};

export function HomeHeader({
  isSidebarOpen = false,
  onMenuClick,
}: HomeHeaderProps) {
  return (
    <header
      className="
    fixed inset-x-0 top-0 z-80 flex h-16 items-center justify-between px-8
    border-b border-(--color-border-strong) bg-(--color-header-surface)
    max-tablet:grid max-tablet:grid-cols-[40px_1fr_auto] max-tablet:items-center max-tablet:overflow-hidden max-tablet:px-4
    "
    >
      <div className="flex items-center gap-6 max-tablet:contents">
        <button
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="hidden size-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-(--color-surface-hover) max-desktop:flex max-tablet:self-center"
          onClick={onMenuClick}
          type="button"
        >
          <Image
            alt={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            height={24}
            src={BurgerMenuIcon}
            width={24}
          />
        </button>
        <Link
          aria-label="Go to homepage"
          className="block size-12 max-tablet:size-10 max-tablet:self-center max-tablet:justify-self-center"
          href="/"
        >
          <Image
            alt="McQueen 95 logo"
            className="h-full w-full object-contain"
            height={48}
            priority
            src={mcqueenLogo}
            width={48}
          />
        </Link>
      </div>
      <div className="max-tablet:self-center max-tablet:justify-self-end">
        <HeaderAuthButton />
      </div>
    </header>
  );
}
