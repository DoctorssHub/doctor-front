"use client";

import Image from "next/image";
import fullScreenIcon from "@/assets/games/provably-fair/fullScreen.svg";
import settingIcon from "@/assets/games/provably-fair/settingIcon.svg";
import type { StaticImageData } from "next/image";
import type { ProvablyFairGame } from "../model/provably-fair-games";
import { ProvablyFairButton } from "./ProvablyFairButton";

type ProvablyFairBarProps = {
  game: ProvablyFairGame;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
};

export function ProvablyFairBar({
  className = "",
  game,
  isFullscreen = false,
  onToggleFullscreen,
}: ProvablyFairBarProps) {
  return (
    <section
      className={`flex items-center justify-between mt-1 rounded-[12px] bg-[#0e121c] p-3 shadow-[0_14px_40px_rgb(0_0_0/20%)] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <FairnessIconButton
          icon={fullScreenIcon}
          isPressed={isFullscreen}
          label="Fullscreen"
          onClick={onToggleFullscreen}
        />
        <FairnessIconButton icon={settingIcon} label="Game settings" />
      </div>

      <ProvablyFairButton game={game} />
    </section>
  );
}

type FairnessIconButtonProps = {
  icon: StaticImageData;
  isPressed?: boolean;
  label: string;
  onClick?: () => void;
};

function FairnessIconButton({
  icon,
  isPressed,
  label,
  onClick,
}: FairnessIconButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={isPressed}
      className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#3f4a59] bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] p-3 transition hover:brightness-110"
      onClick={onClick}
      type="button"
    >
      <Image alt="" height={20} src={icon} width={20} />
    </button>
  );
}
