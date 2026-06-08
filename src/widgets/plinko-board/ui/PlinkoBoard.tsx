"use client";

import { useMemo } from "react";
import type { GameConfig, Risk } from "@/entities/game/model/types";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import {
  type BoardLayout,
  getBoardHeight,
  getBucketLayout,
} from "@/widgets/plinko-board/lib/animation";
import { getMultiplierTone } from "@/widgets/plinko-board/lib/multiplier";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";
import { PlinkoCanvas } from "./PlinkoCanvas";

type PlinkoBoardProps = {
  activeRounds: ActiveRound[];
  config: GameConfig;
  onRoundAnimationComplete: (roundId: string) => void;
  recentMultipliers: number[];
  risk: Risk;
  rows: number;
};

export function PlinkoBoard({
  activeRounds,
  config,
  onRoundAnimationComplete,
  recentMultipliers,
  risk,
  rows,
}: PlinkoBoardProps) {
  const multiplierSlots = config.payoutTables[risk][rows] ?? [];
  const isPhoneBoard = useMediaQuery("(max-width: 767px)");
  const isTabletBoard = useMediaQuery("(max-width: 1023px)");
  const boardLayout: BoardLayout = isPhoneBoard
    ? "compact"
    : isTabletBoard
      ? "tablet"
      : "regular";
  const visibleBucketIndexes = useMemo(
    () =>
      new Set(
        activeRounds
          .filter(
            (round) =>
              round.isResultVisible &&
              round.rows === rows &&
              round.risk === risk,
          )
          .map((round) => round.bet.bucketIndex),
      ),
    [activeRounds, risk, rows],
  );
  const { bucketGap, bucketWidth } = getBucketLayout(rows, boardLayout);
  const boardHeight = getBoardHeight(rows, boardLayout);

  return (
    <section className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden bg-[#0f1720] px-4 py-8 md:min-h-[640px] md:px-8">
      <div className="pointer-events-none absolute top-6 left-1/2 flex -translate-x-1/2 gap-3">
        <span className="h-3.5 w-3.5 rounded-full border border-[#405169]" />
        <span className="h-3.5 w-3.5 rounded-full border border-[#405169]" />
        <span className="h-3.5 w-3.5 rounded-full border border-[#405169]" />
      </div>

      <div className="absolute top-6 right-6 hidden flex-col gap-3 md:flex">
        {recentMultipliers.slice(0, 3).map((multiplier, index) => (
          <div
            className={`flex h-6 min-w-10 items-center justify-center rounded-md px-2 text-[11px] font-bold ${getMultiplierTone(multiplier, false)}`}
            key={`${multiplier}-${index}`}
          >
            {multiplier}x
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-end justify-center pb-4 pt-14">
        <div
          className="relative w-full max-w-160"
          style={{ height: boardHeight }}
        >
          <PlinkoCanvas
            activeRounds={activeRounds}
            layout={boardLayout}
            onAnimationComplete={onRoundAnimationComplete}
            risk={risk}
            rows={rows}
          />

          <div
            className="absolute bottom-0 left-1/2 flex max-w-full -translate-x-1/2 justify-center"
            style={{ gap: bucketGap }}
          >
            {multiplierSlots.map((slot, index) => {
              const isActive = visibleBucketIndexes.has(index);

              return (
                <div
                  className={`flex h-7 items-center justify-center rounded-md border px-1 text-[9px] font-bold transition-[transform,box-shadow,background-color,border-color,color] duration-200 md:h-8 md:text-[10px] ${getMultiplierTone(slot, isActive)}`}
                  key={`${slot}-${index}`}
                  style={{ width: bucketWidth }}
                >
                  {slot}x
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
