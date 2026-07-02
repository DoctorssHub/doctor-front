import type { ReactNode } from "react";
import type { SocialAuthProvider } from "../../model/social-auth";

type SocialAuthButtonProps = {
  provider: SocialAuthProvider;
  label: string;
  icon: ReactNode;
  isPending: boolean;
  isDisabled: boolean;
  onClick: (provider: SocialAuthProvider) => void;
};

export function SocialAuthButton({
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
