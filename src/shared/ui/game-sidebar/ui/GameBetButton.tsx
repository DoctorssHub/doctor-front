"use client";

import { memo } from "react";

type GameBetButtonProps = {
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  label: string;
  onClick: () => void;
};

export const GameBetButton = memo(function GameBetButton({
  className,
  disabled = false,
  isLoading = false,
  label,
  onClick,
}: GameBetButtonProps) {
  const buttonClassName =
    `h-12 w-full rounded-md bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`.trim();

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : null}
        {label}
      </span>
    </button>
  );
});
