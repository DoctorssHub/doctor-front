"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import rulesIcon from "@/assets/shared/rulesIcon.svg";
import closeIcon from "@/assets/games/provably-fair/closeIcon.svg";
import fullScreenIcon from "@/assets/games/provably-fair/fullScreen.svg";
import muteIcon from "@/assets/games/provably-fair/muteIcon.svg";
import settingIcon from "@/assets/games/provably-fair/settingIcon.svg";
import volumeIcon from "@/assets/games/provably-fair/volumeIcon.svg";
import { isTurboModeAvailable } from "@/shared/lib/turbo-mode";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { useGameSoundStore } from "@/shared/model/game-sound-store";
import type { StaticImageData } from "next/image";
import { getModalPortalTarget } from "../lib/modal-portal-target";
import { lockPageScroll } from "../lib/page-scroll-lock";
import { getGameRules } from "../model/game-rules";
import type { GameRuleStep } from "../model/game-rules";
import type { ProvablyFairGame } from "../model/provably-fair-games";
import { ProvablyFairButton } from "./ProvablyFairButton";

type ProvablyFairBarProps = {
  game: ProvablyFairGame;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
};

export const ProvablyFairBar = memo(function ProvablyFairBar({
  className = "",
  game,
  isFullscreen = false,
  onToggleFullscreen,
}: ProvablyFairBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const settingsElement = settingsRef.current;

      if (
        settingsElement &&
        event.target instanceof Node &&
        !settingsElement.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSettingsOpen]);

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
        <div className="relative" ref={settingsRef}>
          <FairnessIconButton
            icon={settingIcon}
            isPressed={isSettingsOpen}
            label="Game settings"
            onClick={() => {
              setIsSettingsOpen((current) => !current);
            }}
          />
          {isSettingsOpen ? (
            <GameSettingsPopover
              game={game}
              onOpenRules={() => {
                setIsSettingsOpen(false);
                setIsRulesOpen(true);
              }}
            />
          ) : null}
        </div>
      </div>

      <ProvablyFairButton game={game} />

      {isRulesOpen ? (
        <GameRulesModal
          game={game}
          onClose={() => {
            setIsRulesOpen(false);
          }}
        />
      ) : null}
    </section>
  );
});

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

type GameSettingsPopoverProps = {
  game: ProvablyFairGame;
  onOpenRules: () => void;
};

function GameSettingsPopover({ game, onOpenRules }: GameSettingsPopoverProps) {
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const toggleTurboMode = useGameSettingsStore(
    (state) => state.toggleTurboMode,
  );
  const isMaxBetControlEnabled = useGameSettingsStore(
    (state) => state.isMaxBetControlEnabled,
  );
  const toggleMaxBetControl = useGameSettingsStore(
    (state) => state.toggleMaxBetControl,
  );
  const volume = useGameSoundStore((state) => state.volume);
  const setVolume = useGameSoundStore((state) => state.setVolume);
  const soundIcon = volume === 0 ? muteIcon : volumeIcon;

  return (
    <div className="absolute bottom-[calc(100%+28px)] left-0 z-20 flex w-[248px] flex-col gap-5 rounded-[24px] bg-[#0a0d19] p-6 shadow-[0_18px_44px_rgb(0_0_0/28%)]">
      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-(--color-brand) px-4 text-sm leading-none font-semibold text-[#071018] transition hover:brightness-110"
        onClick={onOpenRules}
        type="button"
      >
        <Image alt="" height={16} src={rulesIcon} width={16} />
        <span>Game Rules</span>
      </button>
      {isTurboModeAvailable(game) ? (
        <SettingsSwitch
          checked={isTurboModeEnabled}
          label="Turbo Mode"
          onChange={toggleTurboMode}
        />
      ) : null}
      <SettingsSwitch
        checked={isMaxBetControlEnabled}
        label="Max Bet"
        onChange={toggleMaxBetControl}
      />
      <div className="flex items-center gap-5">
        <Image alt="" height={20} src={soundIcon} width={20} />
        <input
          aria-label="Game volume"
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#1c212c] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          max={100}
          min={0}
          onChange={(event) => {
            setVolume(Number(event.target.value));
          }}
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

type GameRulesModalProps = {
  game: ProvablyFairGame;
  onClose: () => void;
};

function GameRulesModal({ game, onClose }: GameRulesModalProps) {
  const rules = getGameRules(game);

  useEffect(() => {
    return lockPageScroll(document.body, document.documentElement);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#030712]/70 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        aria-labelledby="game-rules-title"
        aria-modal="true"
        className="max-h-[calc(100vh-48px)] w-[478px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-[24px] bg-[#151a23] px-6 py-5 shadow-[0_24px_70px_rgb(0_0_0/45%)]"
        onClick={(event) => {
          event.stopPropagation();
        }}
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              alt=""
              className="invert"
              height={16}
              src={rulesIcon}
              width={16}
            />
            <h2
              className="text-lg leading-none font-semibold text-[#fdfdfd]"
              id="game-rules-title"
            >
              {rules.title}
            </h2>
          </div>
          <button
            aria-label="Close game rules"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] transition hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <Image alt="" height={16} src={closeIcon} width={16} />
          </button>
        </div>

        <ol className="space-y-3 text-sm leading-relaxed text-[#fdfdfd]">
          {rules.steps.map((step, index) => (
            <RuleStep index={index} key={`${index}-${step.text}`} step={step} />
          ))}
        </ol>
      </div>
    </div>,
    getModalPortalTarget(document),
  );
}

type RuleStepProps = {
  index: number;
  step: GameRuleStep;
};

function RuleStep({ index, step }: RuleStepProps) {
  return (
    <li>
      <span className="font-semibold">{index + 1}.</span>{" "}
      <span>{step.text}</span>
      {step.items ? (
        <ul className="mt-2 ml-5 list-disc space-y-2 text-xs leading-relaxed text-[#fdfdfd]">
          {step.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </li>
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
        onClick={() => {
          onChange();
        }}
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
