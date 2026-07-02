import Image from "next/image";
import Link from "next/link";
import mcqueenLogo from "@/assets/brand/mcqueen-logo.png";

export function FooterBrand() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 max-tablet:items-start max-tablet:gap-5">
      <Link
        aria-label="McQueen home"
        className="relative block w-fit"
        href="/"
      >
        <Image
          alt="McQueen 95 logo"
          className="size-24 object-contain"
          width={96}
          height={96}
          src={mcqueenLogo}
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
