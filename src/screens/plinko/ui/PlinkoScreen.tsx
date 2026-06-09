"use client";

import { useCallback, useState } from "react";
import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { PlinkoBoard } from "@/widgets/plinko-board/ui/PlinkoBoard";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";
import { mockGameConfig } from "@/widgets/plinko-board/model/mock-config";

function createMockPath(rows: number) {
  const directions = Array.from({ length: rows }, () =>
    Math.random() > 0.5 ? "R" : "L",
  );
  const bucketIndex = directions.filter((direction) => direction === "R").length;

  return {
    bucketIndex,
    path: directions.join(""),
  };
}

function createMockBet({
  amount,
  risk,
  rows,
}: {
  amount: string;
  risk: Risk;
  rows: number;
}): Bet {
  const { bucketIndex, path } = createMockPath(rows);
  const multiplier = mockGameConfig.payoutTables[risk][rows][bucketIndex] ?? 0;
  const normalizedAmount = Number(amount) || 0;

  return {
    amount,
    betId: crypto.randomUUID(),
    bucketIndex,
    multiplier,
    path,
    payout: String(normalizedAmount * multiplier),
    risk,
    rows,
  };
}

export function PlinkoScreen() {
  const [mode, setMode] = useState<GameMode>("Manual");
  const [risk, setRisk] = useState<Risk>("MEDIUM");
  const [rows, setRows] = useState(14);
  const [betAmount, setBetAmount] = useState("0.00");
  const [activeRounds, setActiveRounds] = useState<ActiveRound[]>([]);
  const [recentMultipliers, setRecentMultipliers] = useState([5.6, 0.5, 1]);

  const handleBetClick = useCallback(() => {
    if (mode === "Auto") {
      return;
    }

    const bet = createMockBet({
      amount: betAmount,
      risk,
      rows,
    });

    setActiveRounds((currentRounds) => [
      ...currentRounds,
      {
        bet,
        id: bet.betId,
        isResultVisible: false,
        mode,
        risk,
        rows,
      },
    ]);
  }, [betAmount, mode, risk, rows]);

  const handleRoundAnimationComplete = useCallback((roundId: string) => {
    setActiveRounds((currentRounds) => {
      const completedRound = currentRounds.find(
        (round) => round.id === roundId,
      );

      if (completedRound) {
        setRecentMultipliers((currentMultipliers) => [
          completedRound.bet.multiplier,
          ...currentMultipliers,
        ]);
      }

      return currentRounds.map((round) =>
        round.id === roundId ? { ...round, isResultVisible: true } : round,
      );
    });

    window.setTimeout(() => {
      setActiveRounds((currentRounds) =>
        currentRounds.filter((round) => round.id !== roundId),
      );
    }, 1200);
  }, []);

  return (
    <main className="bg-[#080c17] p-4 text-white md:p-5">
      <section className="mx-auto flex min-h-[640px] max-w-7xl flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0_/_28%)] md:flex-row">
        <GameSidebar
          balance="4,593.24"
          betAmount={betAmount}
          mode={mode}
          onBetAmountChange={setBetAmount}
          onBetClick={handleBetClick}
          onModeChange={setMode}
          onRiskChange={setRisk}
          onRowsChange={setRows}
          risk={risk}
          rows={rows}
        />
        <PlinkoBoard
          activeRounds={activeRounds}
          config={mockGameConfig}
          onRoundAnimationComplete={handleRoundAnimationComplete}
          recentMultipliers={recentMultipliers}
          risk={risk}
          rows={rows}
        />
      </section>

      <div className="mx-auto mt-2 flex max-w-7xl items-center justify-between rounded-lg bg-[#0c111d] px-4 py-3 text-xs">
        <div className="flex gap-2">
          <button
            aria-label="Fullscreen"
            className="grid h-8 w-8 place-items-center rounded-md border border-[#263244] bg-[#1b2230] text-white/70"
            type="button"
          >
            FS
          </button>
          <button
            aria-label="Settings"
            className="grid h-8 w-8 place-items-center rounded-md border border-[#263244] bg-[#1b2230] text-white/70"
            type="button"
          >
            Set
          </button>
        </div>
        <div className="flex items-center gap-2 font-medium text-[#d93a43]">
          <span>Provably Fair</span>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#c82831] text-[10px] text-[#fff7f7]">
            OK
          </span>
        </div>
      </div>
    </main>
  );
}
