import Image from "next/image";
import Logo from "@/shared/assets/Logo.svg";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export function HomeHeader() {
  return (
    <header
      className="
    flex items-center justify-between h-16 px-8
    border-b border-(--color-border-strong) bg-(--color-header-surface)
    "
    >
      <Image
        src={Logo}
        alt="Logo"
      />
      <div>
        <Link href="/login">
          
          <Button className="h-10 w-full text-[16px] text-[#07111a] font-medium cursor-pointer">Log In</Button>
        </Link>
      </div>
    </header>
  );
}
