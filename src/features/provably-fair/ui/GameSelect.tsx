"use client";

import Image from "next/image";
import { useState } from "react";
import arrowSidebarIcon from "@/assets/aside/arrowSidebar.svg";
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
      <label className="mb-2 block text-sm font-light text-[#c7cbd4]">
        Game
      </label>
      <button
        aria-expanded={isOpen}
        className="flex h-11 w-full items-center gap-2 rounded-[8px] border border-[#1b1f26] bg-[#0e121c] px-3 py-3 text-left text-sm font-normal text-[#c7cbd4] transition hover:border-[var(--color-border-button)]"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        type="button"
      >
        <Image alt="" height={16} src={selected.icon} width={16} />
        <span className="flex-1">{selected.label}</span>
        <Image
          alt=""
          className={`-rotate-90 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          height={16}
          src={arrowSidebarIcon}
          width={16}
        />
      </button>

      <div
        aria-hidden={!isOpen}
        className={[
          "absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-auth-modal)] transition-[max-height,opacity,transform] duration-300 ease-out",
          isOpen
            ? "pointer-events-auto max-h-44 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0",
        ].join(" ")}
      >
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
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <Image alt="" height={16} src={option.icon} width={16} />
            <span className="flex-1">{option.label}</span>
            {option.id === value ? <span>{"\u2713"}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
