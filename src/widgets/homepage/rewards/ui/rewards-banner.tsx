import Image from "next/image";

import rewardMoney from "@/assets/dollar-coins.png";

import { RewardCounter } from "./reward-counter";

export function RewardsBanner() {
  return (
    <section
      className="
    relative mt-8 overflow-hidden 
    rounded-xl  
     py-5 pl-31 pr-5 
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
          <h2 className="text-[28px] font-black uppercase text-(--color-brand)">
            Total rewards given back!
          </h2>
          <p className="text-[18px] text-(--color-text-muted)">
            to The Doctors community
          </p>
        </div>
        <RewardCounter />
      </div>
    </section>
  );
}
