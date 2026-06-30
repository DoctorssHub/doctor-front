"use client";

import Image from "next/image";
import { useState } from "react";
import fullScreenIcon from "@/assets/games/provably-fair/fullScreen.svg";
import settingIcon from "@/assets/games/provably-fair/settingIcon.svg";
import volumeIcon from "@/assets/games/provably-fair/volumeIcon.svg";
import { useGameSoundStore } from "@/shared/model/game-sound-store";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <section
      className={`flex items-center justify-between mt-1 rounded-[12px] bg-[#0e121c] p-3 shadow-[0_14px_40px_rgb(0_0_0/20%)] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <FairnessIconButton
          className="max-[1024px]:hidden"
          icon={fullScreenIcon}
          isPressed={isFullscreen}
          label="Fullscreen"
          onClick={onToggleFullscreen}
        />
        <div className="relative">
          <FairnessIconButton
            icon={settingIcon}
            isPressed={isSettingsOpen}
            label="Game settings"
            onClick={() => setIsSettingsOpen((current) => !current)}
          />
          {isSettingsOpen ? <GameSettingsPopover /> : null}
        </div>
      </div>

      <ProvablyFairButton game={game} />
    </section>
  );
}

type FairnessIconButtonProps = {
  className?: string;
  icon: StaticImageData;
  isPressed?: boolean;
  label: string;
  onClick?: () => void;
};

function FairnessIconButton({
  className = "",
  icon,
  isPressed,
  label,
  onClick,
}: FairnessIconButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={isPressed}
      className={`grid h-10 w-10 place-items-center rounded-[8px] border border-[#3f4a59] bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] p-3 transition hover:brightness-110 ${className}`}
      onClick={onClick}
      type="button"
    >
      <Image alt="" height={20} src={icon} width={20} />
    </button>
  );
}

function GameSettingsPopover() {
  const [isTurboMode, setIsTurboMode] = useState(true);
  const [isMaxBet, setIsMaxBet] = useState(false);
  const volume = useGameSoundStore((state) => state.volume);
  const setVolume = useGameSoundStore((state) => state.setVolume);

  return (
    <div className="absolute bottom-[calc(100%+28px)] left-0 z-20 flex h-[164px] w-[248px] flex-col justify-between rounded-[24px] bg-[#0a0d19] p-6 shadow-[0_18px_44px_rgb(0_0_0/28%)]">
      <SettingsSwitch
        checked={isTurboMode}
        label="Turbo Mode"
        onChange={() => setIsTurboMode((current) => !current)}
      />
      <SettingsSwitch
        checked={isMaxBet}
        label="Max Bet"
        onChange={() => setIsMaxBet((current) => !current)}
      />
      <div className="flex items-center gap-5">
        <Image alt="" height={20} src={volumeIcon} width={20} />
        <input
          aria-label="Game volume"
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#1c212c] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          max={100}
          min={0}
          onChange={(event) => setVolume(Number(event.target.value))}
          style={{
            background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${volume}%, #1c212c ${volume}%, #1c212c 100%)`,
          }}
          type="range"
          value={volume}
        />
      </div>
    </div>
  );
}

type SettingsSwitchProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
};

function SettingsSwitch({ checked, label, onChange }: SettingsSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-base leading-none font-normal text-[#c7cbd4]">
        {label}
      </span>
      <button
        aria-checked={checked}
        aria-label={label}
        className={`flex h-5 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-(--color-brand)" : "bg-[#29303c]"
        }`}
        onClick={onChange}
        role="switch"
        type="button"
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
