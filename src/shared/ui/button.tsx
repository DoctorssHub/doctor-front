import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-brand-strong)] text-[var(--color-brand-contrast)] shadow-[var(--shadow-brand-glow)] hover:bg-[var(--color-brand-hover)]"
      : "border border-[var(--color-border-button)] bg-[var(--color-surface-elevated)]/70 text-white hover:bg-[var(--color-surface-hover)]";

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-bold transition ${variantClass} ${className}`}
      {...props}
    />
  );
}
