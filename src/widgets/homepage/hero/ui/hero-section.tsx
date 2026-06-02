import Image from "next/image";

import { figmaAssets } from "@/shared/config/figma-assets";
import { Button } from "@/shared/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border-hero)] bg-[var(--color-hero-surface)] pt-16 lg:pt-0">
      <Image alt="" className="object-cover opacity-70" fill priority src={figmaAssets.heroBg} />
      <div className="absolute inset-0 bg-[image:var(--gradient-hero-overlay)]" />
      <div className="relative mx-auto flex min-h-[252px] max-w-[1210px] items-center justify-between px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-3xl font-black uppercase leading-tight text-white sm:text-5xl">Welcome to The Doctor</h1>
          <p className="mt-3 max-w-[460px] text-sm text-[var(--color-text-muted)]">
            Discover exciting games, earn rewards, and enjoy exclusive bonuses.
          </p>
          <Button className="mt-7">Register</Button>
        </div>
        <button className="hidden size-10 rounded-lg border border-[var(--color-border-control)] bg-[var(--color-surface-control)] text-[var(--color-text-muted)] lg:block">{"<"}</button>
      </div>
      <button className="absolute right-5 top-5 hidden rounded-md bg-[var(--color-brand-strong)] px-5 py-2 text-xs font-bold text-[var(--color-brand-contrast)] lg:block">
        Login
      </button>
    </section>
  );
}
