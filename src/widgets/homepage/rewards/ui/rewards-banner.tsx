import Image from "next/image";

import rewardMoney from "@/assets/homePage/rewards/dollar-coins.png";

import { RewardCounter } from "./reward-counter";

export function RewardsBanner() {
  return (
    <section
      className="
    relative  overflow-hidden 
    rounded-xl  
     py-5 pl-31 pr-5 laptop:max-large:p-4 laptop:max-large:pl-[109px] tablet:max-laptop:p-4 tablet:max-laptop:pl-[94px] max-tablet:p-4 max-tablet:pl-[52px]
    "
      style={{
        backgroundImage:
          "linear-gradient(147deg, rgba(27, 209, 103, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)",
        backgroundColor: "#11121a",
      }}
    >
      <Image
        alt="Dollar coins"
        className="absolute -left-12 -top-5 rotate-9"
        width={148}
        height={148}
        src={rewardMoney}
      />
      <div className="relative flex flex-col  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] font-black uppercase text-(--color-brand) laptop:max-large:text-[24px] tablet:max-laptop:text-[20px] max-tablet:text-[20px]">
            Total rewards given back!
          </h2>
          <p className="text-[18px] text-(--color-text-muted) tablet:max-laptop:text-[14px] max-tablet:text-[14px]">
            to The Doctors community
          </p>
        </div>
        <RewardCounter />
      </div>
    </section>
  );
}
