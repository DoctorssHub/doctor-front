"use client";

import type { ReactNode } from "react";
import { useGameFullscreen } from "../../lib/use-game-fullscreen";

type GameFullscreenShellState = {
  isFullscreen: boolean;
};

type GameFullscreenShellControlsState = GameFullscreenShellState & {
  onToggleFullscreen: () => void;
};

type GameFullscreenShellProps = {
  children: (state: GameFullscreenShellState) => ReactNode;
  className?: string;
  controls: (state: GameFullscreenShellControlsState) => ReactNode;
  fullscreenClassName?: string;
  windowedClassName?: string;
};

export function GameFullscreenShell({
  children,
  className = "game-fullscreen-root game-page-shell-in mx-auto w-full bg-[var(--color-page)] shadow-[var(--shadow-roulette-shell)] transition-[max-width] duration-300 ease-out",
  controls,
  fullscreenClassName = "flex h-screen max-w-none flex-col overflow-x-hidden overflow-y-auto",
  windowedClassName = "max-w-[1017px]",
}: GameFullscreenShellProps) {
  const { fullscreenRef, isFullscreen, toggleFullscreen } = useGameFullscreen();

  return (
    <div
      ref={fullscreenRef}
      className={[
        className,
        isFullscreen ? fullscreenClassName : windowedClassName,
      ].join(" ")}
    >
      {children({ isFullscreen })}
      {controls({
        isFullscreen,
        onToggleFullscreen: toggleFullscreen,
      })}
    </div>
  );
}
