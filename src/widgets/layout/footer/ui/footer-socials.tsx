import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

type SocialLink = {
  icon: StaticImageData;
  label: string;
};

type FooterSocialsProps = {
  className?: string;
  socials: SocialLink[];
};

export function FooterSocials({ className = "", socials }: FooterSocialsProps) {
  return (
    <div className={`pt-0 sm:pt-3.5 ${className}`}>
      <h3 className="mb-4 text-[16px] leading-5 font-medium text-(--color-text-primary) uppercase">
        Socials
      </h3>
      <div className="flex items-center gap-2">
        {socials.map((social) => (
          <Link
            aria-label={social.label}
            className="flex size-9 items-center justify-center rounded-lg bg-(--color-surface-icon) text-xs font-bold text-(--color-text-muted) transition duration-300 hover:-translate-y-0.5 hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
            href="#"
            key={social.label}
          >
            <Image
              alt={social.label}
              className="size-6"
              src={social.icon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
