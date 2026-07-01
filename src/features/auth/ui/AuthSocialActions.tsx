"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  startSocialAuth,
  type SocialAuthProvider,
} from "../model/social-auth";
import type { AuthFlow } from "./types";
import discordIcon from "@/assets/auth/social/discord.webp";
import googleIcon from "@/assets/auth/social/google.webp";
import steamIcon from "@/assets/auth/social/steam.webp";

type AuthSocialActionsProps = {
  flow: AuthFlow;
};

export function AuthSocialActions({ flow }: AuthSocialActionsProps) {
  const [pendingProvider, setPendingProvider] =
    useState<SocialAuthProvider | null>(null);

  if (flow !== "login" && flow !== "register") {
    return null;
  }

  function handleSocialAuth(provider: SocialAuthProvider) {
    setPendingProvider(provider);
    startSocialAuth(provider);
  }

  return (
    <div className="shrink-0 pb-1">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-(--color-auth-divider)" />
        <span className="text-xs font-medium uppercase text-(--color-text-subtle)">or</span>
        <div className="h-px flex-1 bg-(--color-auth-divider)" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-4">
        <SocialAuthButton
          provider="google"
          label="Continue with Google"
          isPending={pendingProvider === "google"}
          isDisabled={pendingProvider !== null}
          icon={
            <Image
              src={googleIcon}
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
            />
          }
          onClick={handleSocialAuth}
        />
        <SocialAuthButton
          provider="discord"
          label="Continue with Discord"
          isPending={pendingProvider === "discord"}
          isDisabled={pendingProvider !== null}
          icon={
            <Image
              src={discordIcon}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          }
          onClick={handleSocialAuth}
        />
        <SocialAuthButton
          provider="steam"
          label="Continue with Steam"
          isPending={pendingProvider === "steam"}
          isDisabled={pendingProvider !== null}
          icon={
            <Image
              src={steamIcon}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          }
          onClick={handleSocialAuth}
        />
      </div>
    </div>
  );
}

type SocialAuthButtonProps = {
  provider: SocialAuthProvider;
  label: string;
  icon: ReactNode;
  isPending: boolean;
  isDisabled: boolean;
  onClick: (provider: SocialAuthProvider) => void;
};

function SocialAuthButton({
  provider,
  label,
  icon,
  isPending,
  isDisabled,
  onClick,
}: SocialAuthButtonProps) {
  return (
    <button
      className="flex h-11 items-center justify-center rounded-lg bg-(--color-auth-control) text-sm font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover) disabled:opacity-60"
      type="button"
      aria-label={label}
      aria-busy={isPending}
      disabled={isDisabled}
      onClick={() => onClick(provider)}
    >
      {icon}
    </button>
  );
}
