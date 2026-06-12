"use client";

import { useMemo } from "react";
import type { GameConfig, Risk } from "@/entities/game/model/types";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import {
  type BoardLayout,
  getBoardHeight,
  getBoardWidth,
  getBucketLayout,
} from "@/widgets/plinko-board/lib/animation";
import { getVisibleBucketImpactKeys } from "@/widgets/plinko-board/lib/bucket-animation";
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
  const isNarrowPhoneBoard = useMediaQuery("(max-width: 340px)");
  const isPhoneBoard = useMediaQuery("(max-width: 767px)");
  const isStackedTabletBoard = useMediaQuery("(max-width: 1023px)");
  const isLaptopBoard = useMediaQuery("(max-width: 1279px)");
  const boardLayout: BoardLayout = isNarrowPhoneBoard
    ? "narrow"
    : isPhoneBoard
      ? "compact"
      : isStackedTabletBoard
        ? "tablet"
      : isLaptopBoard
        ? "laptop"
      : "regular";
  const visibleBucketImpactKeys = useMemo(
    () => getVisibleBucketImpactKeys(activeRounds, rows, risk),
    [activeRounds, risk, rows],
  );
  const {
    bucketGap,
    bucketHeight,
    bucketHorizontalPadding,
    bucketRadius,
    bucketWidth,
  } = getBucketLayout(rows, boardLayout);
  const boardHeight = getBoardHeight(rows, boardLayout);
  const boardWidth = getBoardWidth(boardLayout);

  return (
    <section className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden bg-[#0f1720] px-4 py-6 min-[1024px]:min-h-[524px] max-[1023px]:order-1 max-[1023px]:min-h-[330px] max-[767px]:min-h-[290px] max-[767px]:px-2 max-[767px]:py-5 max-[340px]:min-h-[260px]">
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

      <div className="flex flex-1 items-end justify-center max-[1023px]:items-center">
        <div
          className="relative w-full"
          style={{ height: boardHeight, maxWidth: boardWidth }}
        >
          <PlinkoCanvas
            activeRounds={activeRounds}
            layout={boardLayout}
            onAnimationComplete={onRoundAnimationComplete}
            rows={rows}
          />

          <div
            className="absolute bottom-0 left-1/2 flex max-w-full -translate-x-1/2 justify-center"
            style={{ gap: bucketGap }}
          >
            {multiplierSlots.map((slot, index) => {
              const impactKey = visibleBucketImpactKeys.get(index);
              const isActive = impactKey !== undefined;

              return (
                <div
                  className={`flex origin-bottom items-center justify-center border text-[9px] font-bold transition-[box-shadow,background-color,border-color,color] duration-200 max-[340px]:text-[8px] md:text-[10px] ${isActive ? "plinko-bucket-hit" : ""} ${getMultiplierTone(slot, isActive)}`}
                  key={`${slot}-${index}-${impactKey ?? "idle"}`}
                  style={{
                    borderRadius: bucketRadius,
                    height: bucketHeight,
                    paddingInline: bucketHorizontalPadding,
                    width: bucketWidth,
                  }}
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
