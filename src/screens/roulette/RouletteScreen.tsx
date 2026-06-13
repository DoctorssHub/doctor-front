"use client";

import { useRouletteGame } from "@/features/roulette/model/use-roulette-game";
import { BetControls, RouletteGamePanel } from "@/features/roulette/ui";

export function RouletteScreen() {
  const { betControlsProps, gamePanelProps } = useRouletteGame();

  return (
    <main className="min-h-screen bg-[var(--color-page)]  py-5 text-white md:px-[10px] md:py-7">
      <div className="mx-auto grid w-full max-w-[1017px] overflow-hidden shadow-[var(--shadow-roulette-shell)] max-laptop:flex max-laptop:flex-col laptop:h-[668px] laptop:grid-cols-[352px_665px]">
        <BetControls {...betControlsProps} />
        <RouletteGamePanel {...gamePanelProps} />
      </div>
    </main>
  );
}
