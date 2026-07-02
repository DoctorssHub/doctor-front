"use client";

import type { ProvablyFairGame } from "../model/provably-fair-games";
import { useProvablyFairModalStore } from "../model/provably-fair-modal-store";

type ProvablyFairButtonProps = {
  game?: ProvablyFairGame;
  className?: string;
};

export function ProvablyFairButton({
  className = "",
  game = "roulette",
}: ProvablyFairButtonProps) {

  const openProvablyFairModal = useProvablyFairModalStore(
    (state) => state.openProvablyFairModal,
  );

  return (
    <button
      className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--color-brand)] transition hover:text-[var(--color-brand-hover)] ${className}`}
      onClick={() => {
        openProvablyFairModal(game);
      }}
      type="button"
    >
      Provably Fair
      <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[var(--color-brand)] text-[9px] leading-none text-[var(--color-brand-contrast)]">
        {"\u2713"}
      </span>
    </button>
  );
}
