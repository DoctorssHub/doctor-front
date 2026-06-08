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
        <span className="max-tablet:relative max-tablet:block max-tablet:h-10 max-tablet:w-20 max-tablet:self-center max-tablet:justify-self-center max-tablet:overflow-hidden max-tablet:[mask-image:radial-gradient(ellipse_at_center,black_58%,rgba(0,0,0,0.82)_74%,transparent_96%)]">
          <Image
            src={Logo}
            alt="The Doctor logo"
            className="max-tablet:absolute max-tablet:left-1/2 max-tablet:top-1/2 max-tablet:max-w-none max-tablet:-translate-x-1/2 max-tablet:-translate-y-1/2 max-tablet:scale-[0.9]"
          />
        </span>
      </div>
      <div className="max-tablet:self-center max-tablet:justify-self-end">
        <Link href="/login">
          <Button className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast) max-tablet:h-9 max-tablet:px-4 max-tablet:text-[14px] max-tablet:leading-none">
            Log In
          </Button>
        </Link>
      </div>
    </header>
  );
}
