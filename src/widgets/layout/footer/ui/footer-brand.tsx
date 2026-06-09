import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/footer/Logo_footer.webp";

export function FooterBrand() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 max-tablet:items-start max-tablet:gap-5">
      <Link
        aria-label="The Doctor home"
        className="relative block "
        href="#"
      >
        <Image
          alt="The Doctor logo"
          className="max-tablet:h-auto max-tablet:w-[150px]"
          width={140}
          height={74}
          src={Logo}
        />
      </Link>
      <div className="flex items-center gap-2 text-(--color-text-muted)">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-(--color-text-muted) text-sm font-semibold leading-none">
          18+
        </span>
        <p className="max-w-[140px] text-[16px] leading-5 font-semibold">
          Gamble Responsibly
        </p>
      </div>
    </div>
  );
}
