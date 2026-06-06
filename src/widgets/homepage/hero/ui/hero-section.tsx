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
    <section className="relative overflow-hidden border-b border-(--color-border-hero) bg-(--color-hero-surface) max-[767px]:h-[420px]">
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
       max-w-303  px-10 py-15 max-[767px]:items-start max-[767px]:justify-center max-[767px]:px-4 max-[767px]:py-9"
      >
        <div className="max-[767px]:relative max-[767px]:z-20 max-[767px]:mx-auto max-[767px]:max-w-[340px] max-[767px]:text-center">
          <h1 className="text-[48px] font-black uppercase  text-(--color-text-primary) max-[767px]:text-[26px]">
            Welcome to The Doctor
          </h1>
          <p className="text-[18px] text-(--color-text-muted) max-[767px]:mt-2 max-[767px]:text-[16px]">
            Discover exciting games, earn rewards, and enjoy exclusive bonuses.
          </p>
          <Button className="mt-8 cursor-pointer text-[18px] font-medium max-[767px]:mt-6 max-[767px]:text-[16px]">
            Register
          </Button>
        </div>
      </div>
      <Image
        alt=""
        className="absolute bottom-0 right-0 max-[767px]:bottom-0 max-[767px]:right-[-80px]"
        style={{ filter: "blur(15.5606994628906px)", fill: "#1dba4b" }}
        src={BgBlur}
      />
      <Image
        alt=""
        className="absolute top-[130px] right-[30%] animate-float max-[767px]:bottom-[84px] max-[767px]:right-[67%] max-[767px]:top-auto max-[767px]:w-[54px]"
        width="77"
        height="82"
        src={bgIcon_1}
      />
      <Image
        alt=""
        className="absolute -bottom-5 right-[29%] animate-float animation-delay-2000 max-[767px]:bottom-[34px] max-[767px]:right-[48%] max-[767px]:w-[96px]"
        width="142"
        height="104"
        src={bgIcon_2}
      />
      <Image
        alt=""
        className="absolute -bottom-15 right-[5%]  animate-float animation-delay-4000 max-[767px]:bottom-[18px] max-[767px]:right-[6%] max-[767px]:w-[94px]"
        width="136"
        height="145"
        src={bgIcon_3}
      />
      <Image
        alt=""
        className="absolute top-7 right-[5%] animate-float animation-delay-3000 max-[767px]:bottom-[104px] max-[767px]:right-[10%] max-[767px]:top-auto max-[767px]:w-[112px]"
        width="160"
        height="125"
        src={bgIcon_4}
      />
      <Image
        alt=""
        className="absolute top-0 right-[35%] animate-float animation-delay-1000 max-[767px]:bottom-[116px] max-[767px]:right-[40%] max-[767px]:top-auto max-[767px]:w-[62px]"
        width="89"
        height="98"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute top-[20%] right-[15%] rotate-50 max-[767px]:bottom-[58px] max-[767px]:right-[20%] max-[767px]:top-auto max-[767px]:w-[120px]"
        width="189"
        height="198"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute -bottom-50 -right-25 rotate-30 max-[767px]:-bottom-8 max-[767px]:-right-20 max-[767px]:w-[250px]"
        width="389"
        height="98"
        src={bgIcon_5}
      />
    </section>
  );
}
