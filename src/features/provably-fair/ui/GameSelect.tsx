"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getProvablyFairGameOption,
  PROVABLY_FAIR_GAMES,
  type ProvablyFairGame,
} from "../model/provably-fair-games";

type GameSelectProps = {
  value: ProvablyFairGame;
  onChange: (game: ProvablyFairGame) => void;
};

export function GameSelect({ value, onChange }: GameSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = getProvablyFairGameOption(value);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
        Game
      </label>
      <button
        aria-expanded={isOpen}
        className="flex h-11 w-full items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-left text-[15px] font-bold text-[var(--color-text-primary)] transition hover:border-[var(--color-border-button)]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <Image alt="" height={16} src={selected.icon} width={16} />
        <span className="flex-1">{selected.label}</span>
        <span aria-hidden="true" className="text-lg leading-none">
          {isOpen ? "⌃" : "⌄"}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-auth-modal)]">
          {PROVABLY_FAIR_GAMES.map((option) => (
            <button
              className={[
                "flex h-10 w-full items-center gap-2 px-3 text-left text-sm font-bold transition hover:bg-[var(--color-surface-hover)]",
                option.id === value
                  ? "bg-[var(--color-claim-panel)] text-[var(--color-brand)]"
                  : "text-[var(--color-text-muted)]",
              ].join(" ")}
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              type="button"
            >
              <Image alt="" height={16} src={option.icon} width={16} />
              <span className="flex-1">{option.label}</span>
              {option.id === value ? <span>✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
