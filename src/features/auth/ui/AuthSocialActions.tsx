import Image from "next/image";
import type { AuthFlow } from "./types";

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
        <div className="h-px flex-1 bg-[#202637]" />
        <span className="text-xs font-medium uppercase text-[#8f98ad]">or</span>
        <div className="h-px flex-1 bg-[#202637]" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-4">
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-[#1b2130] text-lg font-bold text-white transition hover:bg-[#22293a]"
          type="button"
          aria-label="Continue with Google"
        >
          <Image
            src="/google-icon.svg"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
        </button>
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-[#1b2130] text-sm font-bold text-white transition hover:bg-[#22293a]"
          type="button"
          aria-label="Continue with Discord"
        >
          <Image
            src="/discord-icon.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </button>
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-[#1b2130] text-sm font-bold text-white transition hover:bg-[#22293a]"
          type="button"
          aria-label="Continue with Steam"
        >
          <Image
            src="/steam-icon.svg"
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
