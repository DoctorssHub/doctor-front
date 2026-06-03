import Image from "next/image";

import heroBg from "@/assets/homepage/hero-bg.svg";
import { Button } from "@/shared/ui/button";

import BgBlur from "@/assets/heroSection/bgBlur.svg";
import bgIcon_1 from "@/assets/heroSection/bgIcon_1.png";
import bgIcon_2 from "@/assets/heroSection/bgIcon_2.png";
import bgIcon_3 from "@/assets/heroSection/bgIcon_3.png";
import bgIcon_4 from "@/assets/heroSection/bgIcon_4.png";
import bgIcon_5 from "@/assets/heroSection/bgIcon_5.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-(--color-border-hero) bg-(--color-hero-surface)">
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
       max-w-303  px-10 py-15 "
      >
        <div className="">
          <h1 className="text-[48px] font-black uppercase  text-(--color-text-primary) ">
            Welcome to The Doctor
          </h1>
          <p className="text-[18px] text-(--color-text-muted)">
            Discover exciting games, earn rewards, and enjoy exclusive bonuses.
          </p>
          <Button className="mt-8 text-[18px] font-medium cursor-pointer">
            Register
          </Button>
        </div>
      </div>
      <Image
        alt=""
        className="absolute bottom-0 right-0  "
        style={{ filter: "blur(15.5606994628906px)", fill: "#1dba4b" }}
        src={BgBlur}
      />
      <Image
        alt=""
        className="absolute top-[130px] right-[30%] animate-float"
        width="77"
        height="82"
        src={bgIcon_1}
      />
      <Image
        alt=""
        className="absolute -bottom-5 right-[29%] animate-float animation-delay-2000"
        width="142"
        height="104"
        src={bgIcon_2}
      />
      <Image
        alt=""
        className="absolute -bottom-15 right-[5%]  animate-float animation-delay-4000"
        width="136"
        height="145"
        src={bgIcon_3}
      />
      <Image
        alt=""
        className="absolute top-7 right-[5%] animate-float animation-delay-3000"
        width="160"
        height="125"
        src={bgIcon_4}
      />
      <Image
        alt=""
        className="absolute top-0 right-[35%] animate-float animation-delay-1000"
        width="89"
        height="98"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute top-[20%] right-[15%] rotate-50"
        width="189"
        height="198"
        src={bgIcon_5}
      />
      <Image
        alt=""
        className="absolute -bottom-50 -right-25 rotate-30"
        width="389"
        height="98"
        src={bgIcon_5}
      />
    </section>
  );
}
