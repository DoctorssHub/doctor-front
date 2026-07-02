import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import onboardAccount from "@/assets/homePage/onboarding/onboardingBg_1.webp";
import onboardDiscord from "@/assets/homePage/onboarding/onboardingBg_2.webp";
import onboardConnect from "@/assets/homePage/onboarding/onboardingBg_3.webp";
import OnboardingIcon from "@/assets/homePage/onboarding/onboardingIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";

import { CopyButton } from "./copy-button";

type Step = {
  action: string;
  actionHref: string;
  imageAlt: string;
  image: typeof onboardAccount;
  text: ReactNode;
  title: string;
};

const steps: Step[] = [
  {
    action: "Register",
    actionHref: "https://degencity.com/r/thedoctor",
    imageAlt: "Create account onboarding preview",
    image: onboardAccount,
    text: (
      <>
        Register on DegenCity using promo code{" "}
        <span className="font-black text-(--color-brand-strong)">
          THEDOCTOR
        </span>
        <CopyButton value="THEDOCTOR" />
        <br />
        Please clear your browser cache and/or cookies before creating your
        account.
      </>
    ),
    title: "Create your DegenCity account",
  },
  {
    action: "Join Discord",
    actionHref: "https://discord.com/invite/thedoctor",
    imageAlt: "Discord onboarding preview",
    image: onboardDiscord,
    text: (
      <>
        Make sure you&apos;re Super Confirmed to be eligible. Weekly giveaways and
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
    actionHref: "/profile?tab=connections",
    imageAlt: "Connect account onboarding preview",
    image: onboardConnect,
    text: (
      <>
        Link your Discord to your{" "}
        <span className="font-semibold text-(--color-brand-strong)">
          thedoctor.net
        </span>{" "}
        profile
      </>
    ),
    title: "Connect your account",
  },
];

const actionClassName = "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-(--color-brand-strong) px-6 text-[18px] font-medium text-(--color-brand-contrast) shadow-(--shadow-brand-glow) transition hover:bg-(--color-brand-hover) tablet:max-laptop:h-10 tablet:max-laptop:text-[16px]";

export function OnboardingSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="How to get started?"
        icon={OnboardingIcon}
      />
      <div className="grid gap-4 tablet:max-laptop:grid-cols-2 lg:grid-cols-3 ">
        {steps.map((step) => (
          <article
            className="h-[418px] overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-soft) tablet:max-laptop:h-[360px]"
            key={step.title}
          >
            <div className="relative h-[210px] w-full tablet:max-laptop:h-[160px]">
              <Image
                alt={step.imageAlt}
                className="object-cover"
                fill
                src={step.image}
              />
            </div>
            <div className="flex h-[calc(100%-210px)] flex-col justify-between gap-2 p-4 tablet:max-laptop:h-[calc(100%-160px)]">
              <div>
                <h3 className="font-semibold text-[18px] text-(--color-text-primary)">
                  {step.title}
                </h3>
                <p className="flex-1 mt-2 text-sm font-normal text-(--color-text-muted)">
                  {step.text}
                </p>
              </div>
              {step.actionHref.startsWith("/") ? (
                <Link className={actionClassName} href={step.actionHref}>
                  {step.action}
                </Link>
              ) : (
                <a
                  className={actionClassName}
                  href={step.actionHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  {step.action}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
