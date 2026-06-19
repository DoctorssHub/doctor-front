import Image from "next/image";

import heroBg from "@/assets/homePage/heroSection/hero-bg.svg";

import BgBlur from "@/assets/homePage/heroSection/bgBlur.svg";

import { HeroRegisterButton } from "./hero-register-button";

export function HeroSection() {
  return (
    <section className="relative min-h-[274px] overflow-hidden border-b border-(--color-border-hero) bg-(--color-hero-surface) max-tablet:h-[420px]">
      <Image
        alt="The Doctor hero background"
        className="object-cover opacity-70"
        fill
        priority
        src={heroBg}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            " linear-gradient(47deg, rgba(15, 22, 26, 0.94) 0%, rgba(19, 21, 23, 0.94) 100%)",
        }}
      />
      <div
        className="relative mx-auto flex items-center justify-between 
       max-w-303  px-10 py-15 max-tablet:items-start max-tablet:justify-center max-tablet:px-4 max-tablet:py-9"
      >
        <div className="max-tablet:relative max-tablet:z-20 max-tablet:mx-auto max-tablet:max-w-[340px] max-tablet:text-center min-[768px]:max-[1279px]:max-w-[clamp(480px,62vw,800px)]">
          <h1 className="text-[48px] font-black uppercase text-(--color-text-primary) max-tablet:text-[24px] min-[768px]:max-[1279px]:text-[40px]">
            <span>Welcome to</span>{" "}
            <span className="whitespace-nowrap">McQueen Casino</span>
          </h1>
          <p className="text-[18px] text-(--color-text-muted) max-tablet:mt-2 max-tablet:text-[16px]">
            Discover exciting games, earn rewards, and enjoy exclusive bonuses.
          </p>
          <HeroRegisterButton />
        </div>
      </div>
      <Image
        alt="Red hero glow"
        className="absolute bottom-0 right-0 max-tablet:bottom-0 max-tablet:right-[-80px]"
        style={{ filter: "blur(15.5606994628906px)" }}
        src={BgBlur}
      />
      <Image
        alt="Lightning McQueen"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 right-[2%] z-10 h-auto w-[450px] drop-shadow-[0_22px_28px_rgb(0_0_0/45%)] max-tablet:-right-12 max-tablet:w-[280px] min-[768px]:max-[1279px]:w-[clamp(250px,34vw,360px)] min-[1280px]:max-[1535px]:right-[-4%] min-[1280px]:max-[1535px]:w-[430px]"
        height={297}
        priority
        src="/lightning-mcqueen.png"
        width={500}
      />
    </section>
  );
}
