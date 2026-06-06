import Image from "next/image";
import type { ReactNode } from "react";

import onboardAccount from "@/assets/onboardingBg_1.webp";
import onboardDiscord from "@/assets/onboardingBg_2.webp";
import onboardConnect from "@/assets/onboardingBg_3.webp";
import OnboardingIcon from "@/assets/onboardingIcon.svg";
import { Button } from "@/shared/ui/button";
import { SectionTitle } from "@/shared/ui/section-title";

import { CopyButton } from "./copy-button";

type Step = {
  action: string;
  image: typeof onboardAccount;
  text: ReactNode;
  title: string;
};

const steps: Step[] = [
  {
    action: "Register",
    image: onboardAccount,
    text: (
      <>
        Register on DegenCity using promo code{" "}
        <span className="font-black text-(--color-brand-strong)">
          THEDOCTOR
        </span>
        <CopyButton value="THEDOCTOR" /><br />
        Please clear your browser cache and/or cookies before creating your account.
      </>
    ),
    title: "Create your DegenCity account",
  },
  {
    action: "Join Discord",
    image: onboardDiscord,
    text: (
      <>
        Make sure you’re Super Confirmed to be eligible. Weekly giveaways and
        promotions are posted in Discord under{" "}
        <span className="font-semibold text-(--color-brand-strong)">
          Giveaways
        </span>{" "}
        and{" "}
        <span className="font-semibold text-(--color-brand-strong)">
          Announcements
        </span>
        .
      </>
    ),
    title: "Join TheDoctor's Discord",
  },
  {
    action: "Connect Account",
    image: onboardConnect,
    text: <>Link your Discord to your  <span className="font-semibold text-(--color-brand-strong)">thedoctor.net</span> profile</>,
    title: "Connect your account",
  },
];

export function OnboardingSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="How to get started?"
        icon={OnboardingIcon}
      />
      <div className="grid gap-4 min-[768px]:max-[1023px]:grid-cols-2 lg:grid-cols-3 ">
        {steps.map((step) => (
          <article
            className="h-[418px] overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft) min-[768px]:max-[1023px]:h-[360px]"
            key={step.title}
          >
            <div className="relative h-[210px] w-full min-[768px]:max-[1023px]:h-[160px]">
              <Image
                alt=""
                className="object-cover"
                fill
                src={step.image}
              />
            </div>
            <div className="flex h-[calc(100%-210px)] flex-col justify-between gap-2 p-4 min-[768px]:max-[1023px]:h-[calc(100%-160px)]">
              <div>

              <h3 className="font-semibold text-[18px] text-(--color-text-primary)">{step.title}</h3>
              <p className="flex-1 mt-2 text-sm font-normal text-(--color-text-muted)">
                {step.text}
              </p>
              </div>
              <Button className="h-12 w-full cursor-pointer text-[18px] font-medium min-[768px]:max-[1023px]:h-10 min-[768px]:max-[1023px]:text-[16px]">{step.action}</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
