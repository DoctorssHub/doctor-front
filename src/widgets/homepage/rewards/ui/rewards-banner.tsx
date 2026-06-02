import Image from "next/image";

import rewardMoney from "@/assets/homepage/reward-money.png";

export function RewardsBanner() {
  return (
    <section className="relative -mt-3 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft) p-5 shadow-(--shadow-inset-soft)">
      <Image alt="" className="absolute -left-8 -top-12 object-contain opacity-70" height={144} src={rewardMoney} width={176} />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="pl-16">
          <h2 className="text-lg font-black uppercase text-(--color-brand)">Total rewards given back!</h2>
          <p className="text-sm text-(--color-text-muted)">To The Doctors community</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-(--color-surface-counter) px-4 py-3">
          <span className="text-2xl font-black text-(--color-brand)">$</span>
          {"1836855".split("").map((digit, index) => (
            <span className="grid size-8 place-items-center rounded bg-(--color-surface-chip) text-lg font-black" key={`${digit}-${index}`}>
              {digit}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
