"use client";

import { KenoGamePanel } from "@/features/keno";
import { ProvablyFairBar } from "@/features/provably-fair";
import { GameFullscreenShell } from "@/shared";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { BetHistoryTable } from "@/widgets/bet-history";

export function KenoScreen() {
  return (
    <main className="min-h-screen bg-[var(--color-page)] py-5 text-white md:px-[10px] md:py-7">
      <GameFullscreenShell
        controls={({ isFullscreen, onToggleFullscreen }) => (
          <ProvablyFairBar
            game="keno"
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      >
        {({ isFullscreen }) => <KenoGamePanel isFullscreen={isFullscreen} />}
      </GameFullscreenShell>
      <ScrollReveal delayMs={90}>
        <BetHistoryTable
          className="game-page-table-in mx-auto mt-8 w-full max-w-[1017px]"
          game="keno"
          variant="game-live"
        />
      </ScrollReveal>
    </main>
  );
}
