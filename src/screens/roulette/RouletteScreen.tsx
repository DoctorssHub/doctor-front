"use client";

import { ProvablyFairBar } from "@/features/provably-fair";
import { useGameFullscreen } from "@/features/provably-fair/model/use-game-fullscreen";
import { useRouletteGame } from "@/features/roulette/model/use-roulette-game";
import { BetControls, RouletteGamePanel } from "@/features/roulette/ui";
import { BetHistoryTable } from "@/widgets/bet-history";

export function RouletteScreen() {
  const { betControlsProps, gamePanelProps } = useRouletteGame();
  const { fullscreenRef, isFullscreen, toggleFullscreen } = useGameFullscreen();

  return (
    <main className="min-h-screen bg-[var(--color-page)]  py-5 text-white md:px-[10px] md:py-7">
      <div
        ref={fullscreenRef}
        className={[
          "game-fullscreen-root game-page-shell-in mx-auto w-full bg-[var(--color-page)] shadow-[var(--shadow-roulette-shell)] transition-[max-width] duration-300 ease-out",
          isFullscreen
            ? "flex h-screen max-w-none flex-col overflow-x-hidden overflow-y-auto"
            : "max-w-[1017px]",
        ].join(" ")}
      >
        <div
          className={[
            "grid w-full rounded-t-2xl max-laptop:flex max-laptop:flex-col",
            isFullscreen
              ? "min-h-[668px] flex-1 shrink-0 overflow-visible rounded-none laptop:h-auto laptop:grid-cols-[352px_minmax(0,1fr)]"
              : "overflow-hidden laptop:h-[668px] laptop:grid-cols-[352px_665px]",
          ].join(" ")}
        >
          <BetControls {...betControlsProps} isFullscreen={isFullscreen} />
          <RouletteGamePanel {...gamePanelProps} isFullscreen={isFullscreen} />
        </div>
        <ProvablyFairBar
          game="roulette"
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
      <BetHistoryTable
        className="game-page-table-in mx-auto mt-8 w-full max-w-[1017px]"
        game="roulette"
        variant="game-live"
      />
    </main>
  );
}
