import Image from "next/image";

import onboardAccount from "@/assets/homepage/onboard-account.png";
import onboardConnect from "@/assets/homepage/onboard-connect.png";
import onboardDiscord from "@/assets/homepage/onboard-discord.png";
import { Button } from "@/shared/ui/button";
import { SectionTitle } from "@/shared/ui/section-title";

const steps = [
  {
    action: "Register",
    image: onboardAccount,
    text: "Register on DegenCity using promo code THEDOCTOR.",
    title: "Create your DegenCity account",
  },
  {
    action: "Join Discord",
    image: onboardDiscord,
    text: "Make sure you have confirmed the private Doctor Verify Giveaway and Announcement channels.",
    title: "Join TheDoctor's Discord",
  },
  {
    action: "Connect Account",
    image: onboardConnect,
    text: "Link your Discord to your TheDoctor profile.",
    title: "Connect your account",
  },
];

export function OnboardingSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle title="How to get started?" />
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <article className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft)" key={step.title}>
            <div className="relative h-40 w-full">
              <Image alt="" className="object-cover" fill src={step.image} />
            </div>
            <div className="flex min-h-[154px] flex-col gap-2 p-4">
              <h3 className="font-black text-white">{step.title}</h3>
              <p className="flex-1 text-sm leading-5 text-(--color-text-muted)">{step.text}</p>
              <Button className="h-9 w-full text-xs">{step.action}</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
