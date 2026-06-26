"use client";

import { KenoGamePanel } from "@/features/keno";
import { ProvablyFairBar } from "@/features/provably-fair";
import { useGameFullscreen } from "@/features/provably-fair/model/use-game-fullscreen";
import { BetHistoryTable } from "@/widgets/bet-history";

export function KenoScreen() {
  const { fullscreenRef, isFullscreen, toggleFullscreen } = useGameFullscreen();

  return (
    <main className="min-h-screen bg-[var(--color-page)] py-5 text-white md:px-[10px] md:py-7">
      <div
        ref={fullscreenRef}
        className={[
          "game-fullscreen-root game-page-shell-in mx-auto w-full bg-[var(--color-page)] shadow-[var(--shadow-roulette-shell)] transition-[max-width] duration-300 ease-out",
          isFullscreen
            ? "flex h-screen max-w-none flex-col overflow-x-hidden overflow-y-auto"
            : "max-w-[1017px]",
        ].join(" ")}
      >
        <KenoGamePanel isFullscreen={isFullscreen} />
        <ProvablyFairBar
          game="keno"
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
      <BetHistoryTable
        className="game-page-table-in mx-auto mt-8 w-full max-w-[1017px]"
        game="keno"
        variant="game-live"
      />
    </main>
  );
}
