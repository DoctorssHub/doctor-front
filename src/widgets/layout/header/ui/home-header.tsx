import Image from "next/image";
import Logo from "@/assets/header/Logo.svg";
import BurgerMenuIcon from "@/assets/header/burgerMenu.svg";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

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
    sticky top-0 z-30 flex h-16 items-center justify-between px-8
    border-b border-(--color-border-strong) bg-(--color-header-surface)
    max-[767px]:grid max-[767px]:grid-cols-[40px_1fr_auto] max-[767px]:items-center max-[767px]:overflow-hidden max-[767px]:px-4
    "
    >
      <div className="flex items-center gap-6 max-[767px]:contents">
        <button
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="hidden size-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-(--color-surface-hover) max-[1279px]:flex max-[767px]:self-center"
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
        <span className="max-[767px]:relative max-[767px]:block max-[767px]:h-10 max-[767px]:w-20 max-[767px]:self-center max-[767px]:justify-self-center max-[767px]:overflow-hidden max-[767px]:[mask-image:radial-gradient(ellipse_at_center,black_58%,rgba(0,0,0,0.82)_74%,transparent_96%)]">
          <Image
            src={Logo}
            alt="Logo"
            className="max-[767px]:absolute max-[767px]:left-1/2 max-[767px]:top-1/2 max-[767px]:max-w-none max-[767px]:-translate-x-1/2 max-[767px]:-translate-y-1/2 max-[767px]:scale-[0.9]"
          />
        </span>
      </div>
      <div className="max-[767px]:self-center max-[767px]:justify-self-end">
        <Link href="/login">
          <Button className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast) max-[767px]:h-9 max-[767px]:px-4 max-[767px]:text-[14px] max-[767px]:leading-none">
            Log In
          </Button>
        </Link>
      </div>
    </header>
  );
}
