"use client";

import { ProvablyFairBar } from "@/features/provably-fair";
import { useGameFullscreen } from "@/features/provably-fair/model/use-game-fullscreen";
import { useDiceGame } from "@/features/dice";
import { DiceBetControls, DiceGamePanel } from "@/features/dice/ui";

export function DiceScreen() {
  const { betControlsProps, gamePanelProps } = useDiceGame();
  const { fullscreenRef, isFullscreen, toggleFullscreen } = useGameFullscreen();

  return (
    <main className="min-h-screen bg-[var(--color-page)] py-5 text-white md:px-[10px] md:py-7">
      <div
        ref={fullscreenRef}
        className={`mx-auto w-full bg-[var(--color-page)] shadow-[var(--shadow-roulette-shell)] transition-[max-width] duration-300 ease-out ${
          isFullscreen
            ? "flex h-screen max-w-none flex-col overflow-hidden"
            : "max-w-[1017px]"
        }`}
      >
        <div
          className={`grid w-full overflow-hidden rounded-t-2xl max-laptop:flex max-laptop:flex-col ${
            isFullscreen
              ? "flex-1 rounded-none laptop:h-auto laptop:grid-cols-[352px_minmax(0,1fr)]"
              : "laptop:h-[668px] laptop:grid-cols-[352px_665px]"
          }`}
        >
          <DiceBetControls {...betControlsProps} />
          <DiceGamePanel {...gamePanelProps} />
        </div>
        <ProvablyFairBar
          game="dice"
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </main>
  );
}
