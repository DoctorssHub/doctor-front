import Image from "next/image";
import Logo from "@/assets/Logo.svg";
import BurgerMenuIcon from "@/assets/burgerMenu.svg";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

type HomeHeaderProps = {
  isSidebarOpen?: boolean;
  onMenuClick?: () => void;
};

export function HomeHeader({ isSidebarOpen = false, onMenuClick }: HomeHeaderProps) {
  return (
    <header
      className="
    sticky top-0 z-30 flex h-16 items-center justify-between px-8
    border-b border-(--color-border-strong) bg-(--color-header-surface)
    max-[767px]:px-4
    "
    >
      <div className="flex items-center gap-6">
        <button
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="hidden size-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-(--color-surface-hover) max-[1279px]:flex"
          onClick={onMenuClick}
          type="button"
        >
          <Image
            alt=""
            height={24}
            src={BurgerMenuIcon}
            width={24}
          />
        </button>
        <Image
          src={Logo}
          alt="Logo"
        />
      </div>
      <div>
        <Link href="/login">
          <Button className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast)">Log In</Button>
        </Link>
      </div>
    </header>
  );
}
