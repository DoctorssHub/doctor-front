import Image from "next/image";
import type { AuthFlow } from "./types";
import discordIcon from "@/assets/auth/social/discord.webp";
import googleIcon from "@/assets/auth/social/google.webp";
import steamIcon from "@/assets/auth/social/steam.webp";

type AuthSocialActionsProps = {
  flow: AuthFlow;
};

export function AuthSocialActions({ flow }: AuthSocialActionsProps) {
  if (flow !== "login" && flow !== "register") {
    return null;
  }

  return (
    <div className="shrink-0 pb-1">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-(--color-auth-divider)" />
        <span className="text-xs font-medium uppercase text-(--color-text-subtle)">or</span>
        <div className="h-px flex-1 bg-(--color-auth-divider)" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-4">
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-(--color-auth-control) text-lg font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover)"
          type="button"
          aria-label="Continue with Google"
        >
          <Image
            src={googleIcon}
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
        </button>
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-(--color-auth-control) text-sm font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover)"
          type="button"
          aria-label="Continue with Discord"
        >
          <Image
            src={discordIcon}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </button>
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-(--color-auth-control) text-sm font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover)"
          type="button"
          aria-label="Continue with Steam"
        >
          <Image
            src={steamIcon}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
