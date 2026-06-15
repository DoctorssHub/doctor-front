"use client";

import { memo, useMemo } from "react";
import type { GameConfig, Risk } from "@/entities/game/model/types";
import { getPlinkoBoardMetrics } from "@/widgets/plinko-board/lib/board-metrics";
import { getVisibleBucketImpactKeys } from "@/widgets/plinko-board/lib/bucket-animation";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";
import { usePlinkoBoardLayout } from "@/widgets/plinko-board/model/usePlinkoBoardLayout";
import { PlinkoBuckets } from "./PlinkoBuckets";
import { PlinkoCanvas } from "./PlinkoCanvas";
import { RecentMultipliers } from "./RecentMultipliers";

type PlinkoBoardProps = {
  activeRounds: ActiveRound[];
  config: GameConfig;
  onRoundAnimationComplete: (roundId: string) => void;
  recentMultipliers: number[];
  risk: Risk;
  rows: number;
};

export const PlinkoBoard = memo(function PlinkoBoard({
  activeRounds,
  config,
  onRoundAnimationComplete,
  recentMultipliers,
  risk,
  rows,
}: PlinkoBoardProps) {
  const multiplierSlots = config.payoutTables[risk][rows] ?? [];
  const boardLayout = usePlinkoBoardLayout();
  const visibleBucketImpactKeys = useMemo(
    () => getVisibleBucketImpactKeys(activeRounds, rows, risk),
    [activeRounds, risk, rows],
  );
  const {
    boardHeight,
    boardWidth,
    bucketLayout,
  } = useMemo(
    () => getPlinkoBoardMetrics(rows, boardLayout),
    [boardLayout, rows],
  );

  return (
    <section className="relative flex min-h-[520px] flex-1 flex-col overflow-hidden bg-[#0f1720] px-4 py-6 min-[1024px]:min-h-[524px] max-[1023px]:order-1 max-[1023px]:min-h-[330px] max-[767px]:min-h-[290px] max-[767px]:px-2 max-[767px]:py-5 max-[340px]:min-h-[260px]">
      <RecentMultipliers multipliers={recentMultipliers} />

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

          <PlinkoBuckets
            impactKeys={visibleBucketImpactKeys}
            layout={bucketLayout}
            multiplierSlots={multiplierSlots}
          />
        </div>
      </div>
    </section>
  );
});
