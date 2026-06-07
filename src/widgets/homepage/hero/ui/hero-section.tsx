import Image from "next/image";

import heroBg from "@/assets/homePage/heroSection/hero-bg.svg";
import { Button } from "@/shared/ui/button";

import BgBlur from "@/assets/homePage/heroSection/bgBlur.svg";
import bgIcon_1 from "@/assets/homePage/heroSection/bgIcon_1.png";
import bgIcon_2 from "@/assets/homePage/heroSection/bgIcon_2.png";
import bgIcon_3 from "@/assets/homePage/heroSection/bgIcon_3.png";
import bgIcon_4 from "@/assets/homePage/heroSection/bgIcon_4.png";
import bgIcon_5 from "@/assets/homePage/heroSection/bgIcon_5.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-(--color-border-hero) bg-(--color-hero-surface) max-tablet:h-[420px]">
      <Image
        alt=""
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
        <div className="max-tablet:relative max-tablet:z-20 max-tablet:mx-auto max-tablet:max-w-[340px] max-tablet:text-center">
          <h1 className="text-[48px] font-black uppercase  text-(--color-text-primary) max-tablet:text-[26px]">
            Welcome to The Doctor
          </h1>
          <p className="text-[18px] text-(--color-text-muted) max-tablet:mt-2 max-tablet:text-[16px]">
            Discover exciting games, earn rewards, and enjoy exclusive bonuses.
          </p>
          <Button className="mt-8 cursor-pointer text-[18px] font-medium max-tablet:mt-6 max-tablet:text-[16px]">
            Register
          </Button>
        </div>
      </div>
      <Image
        alt=""
        className="absolute bottom-0 right-0 max-tablet:bottom-0 max-tablet:right-[-80px]"
        style={{ filter: "blur(15.5606994628906px)", fill: "#1dba4b" }}
        src={BgBlur}
      />
      <Image
        alt=""
        className="absolute top-[130px] right-[30%] animate-float max-tablet:bottom-[84px] max-tablet:right-[67%] max-tablet:top-auto max-tablet:w-[54px]"
        width="77"
        height="82"
        src={bgIcon_1}
      />
      <Image
        alt=""
        className="absolute -bottom-5 right-[29%] animate-float animation-delay-2000 max-tablet:bottom-[34px] max-tablet:right-[48%] max-tablet:w-[96px]"
        width="142"
        height="104"
        src={bgIcon_2}
      />
      <Image
        alt=""
        className="absolute -bottom-15 right-[5%]  animate-float animation-delay-4000 max-tablet:bottom-[18px] max-tablet:right-[6%] max-tablet:w-[94px]"
        width="136"
        height="145"
        src={bgIcon_3}
      />
      <Image
        alt=""
        className="absolute top-7 right-[5%] animate-float animation-delay-3000 max-tablet:bottom-[104px] max-tablet:right-[10%] max-tablet:top-auto max-tablet:w-[112px]"
        width="160"
        height="125"
        src={bgIcon_4}
      />
      <Image
        alt=""
        className="absolute top-0 right-[35%] animate-float animation-delay-1000 max-tablet:bottom-[116px] max-tablet:right-[40%] max-tablet:top-auto max-tablet:w-[62px]"
        width="89"
        height="98"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute top-[20%] right-[15%] rotate-50 max-tablet:bottom-[58px] max-tablet:right-[20%] max-tablet:top-auto max-tablet:w-[120px]"
        width="189"
        height="198"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute -bottom-50 -right-25 rotate-30 max-tablet:-bottom-8 max-tablet:-right-20 max-tablet:w-[250px]"
        width="389"
        height="98"
        src={bgIcon_5}
      />
    </section>
  );
}
