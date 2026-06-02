import Image from "next/image";
import Logo from "@/assets/Logo.svg";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export function HomeHeader() {
  return (
    <header
      className="
    sticky top-0 z-30 flex h-16 items-center justify-between px-8
    border-b border-(--color-border-strong) bg-(--color-header-surface)
    "
    >
      <Image
        src={Logo}
        alt="Logo"
      />
      <div>
        <Link href="/login">
          <Button className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast)">Log In</Button>
        </Link>
      </div>
    </header>
  );
}
