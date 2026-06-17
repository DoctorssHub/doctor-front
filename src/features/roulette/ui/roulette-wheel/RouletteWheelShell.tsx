import type { ReactNode } from "react";

type RouletteWheelShellProps = {
  children: ReactNode;
};

export function RouletteWheelShell({ children }: RouletteWheelShellProps) {
  return (
    <div className="flex min-h-[304px] items-center justify-center">
      <div
        className="relative select-none"
        style={{
          height: 283,
          transformStyle: "preserve-3d",
          width: 283,
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[image:var(--gradient-roulette-wheel-ring)]" />
        <div className="absolute left-1/2 top-1/2 h-[274px] w-[274px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-roulette-wheel-border)] bg-[image:var(--gradient-roulette-wheel-surface)]" />
        {children}
      </div>
    </div>
  );
}
