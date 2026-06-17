import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-(--color-brand-strong) text-(--color-brand-contrast) shadow-(--shadow-brand-glow) hover:bg-(--color-brand-hover)"
      : "border border-(--color-border-button) bg-(--color-surface-elevated)/70 text-white hover:bg-(--color-surface-hover)";

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-bold transition ${variantClass} ${className}`}
      {...props}
    />
  );
}
