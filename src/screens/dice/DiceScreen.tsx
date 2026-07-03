"use client";

import { useDiceGame } from "@/features/dice";
import { DiceBetControls, DiceGamePanel } from "@/features/dice/ui";
import { ProvablyFairBar } from "@/features/provably-fair";
import { GameFullscreenShell } from "@/shared";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { BetHistoryTable } from "@/widgets/bet-history";

export function DiceScreen() {

  const { betControlsProps, gamePanelProps } = useDiceGame();

  return (
    <main className="min-h-screen bg-[var(--color-page)] py-5 text-white md:px-[10px] md:py-7">
      <GameFullscreenShell
        controls={({ isFullscreen, onToggleFullscreen }) => (
          <ProvablyFairBar
            game="dice"
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      >
        {({ isFullscreen }) => (
          <div
            className={`grid w-full rounded-2xl max-laptop:flex max-laptop:flex-col ${
              isFullscreen
                ? "min-h-[668px] flex-1 shrink-0 overflow-visible rounded-none laptop:h-auto laptop:grid-cols-[352px_minmax(0,1fr)]"
                : "overflow-hidden laptop:h-[668px] laptop:grid-cols-[352px_665px]"
            }`}
          >
            <DiceBetControls {...betControlsProps} isFullscreen={isFullscreen} />
            <DiceGamePanel {...gamePanelProps} isFullscreen={isFullscreen} />
          </div>
        )}
      </GameFullscreenShell>
      <ScrollReveal delayMs={90}>
        <BetHistoryTable
          className="game-page-table-in mx-auto mt-8 max-w-240"
          game="dice"
          variant="game-live"
        />
      </ScrollReveal>
    </main>
  );
}
