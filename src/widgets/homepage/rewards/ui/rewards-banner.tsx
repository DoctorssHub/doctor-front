import Image from "next/image";

import rewardMoney from "@/assets/dollar-coins.png";

import { RewardCounter } from "./reward-counter";

export function RewardsBanner() {
  return (
    <section
      className="
    relative  overflow-hidden 
    rounded-xl  
     py-5 pl-31 pr-5 min-[1024px]:max-[1279px]:p-4 min-[1024px]:max-[1279px]:pl-[109px] min-[768px]:max-[1023px]:p-4 min-[768px]:max-[1023px]:pl-[94px] max-[767px]:p-4 max-[767px]:pl-[52px]
    "
      style={{
        backgroundImage:
          "linear-gradient(147deg, rgba(27, 209, 103, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)",
        backgroundColor: "#11121a",
      }}
    >
      <Image
        alt=""
        className="absolute -left-12 -top-5 rotate-9"
        width={148}
        height={148}
        src={rewardMoney}
      />
      <div className="relative flex flex-col  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] font-black uppercase text-(--color-brand) min-[1024px]:max-[1279px]:text-[24px] min-[768px]:max-[1023px]:text-[20px] max-[767px]:text-[20px]">
            Total rewards given back!
          </h2>
          <p className="text-[18px] text-(--color-text-muted) min-[768px]:max-[1023px]:text-[14px] max-[767px]:text-[14px]">
            to The Doctors community
          </p>
        </div>
        <RewardCounter />
      </div>
    </section>
  );
}
