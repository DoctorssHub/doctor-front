"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  isFullscreen?: boolean;
  onRoundAnimationComplete: (roundId: string) => void;
  recentMultipliers: number[];
  risk: Risk;
  rows: number;
};

export const PlinkoBoard = memo(function PlinkoBoard({
  activeRounds,
  config,
  isFullscreen = false,
  onRoundAnimationComplete,
  recentMultipliers,
  risk,
  rows,
}: PlinkoBoardProps) {
  const multiplierSlots = config.payoutTables[risk][rows] ?? [];
  const boardLayout = usePlinkoBoardLayout();
  const boardFrameRef = useRef<HTMLDivElement>(null);
  const boardFrameSize = useElementSize(boardFrameRef);
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
  const fullscreenScale = isFullscreen
    ? Math.max(
        0.1,
        Math.min(
          boardFrameSize.width / boardWidth || 1,
          Math.max(0, boardFrameSize.height - 16) / boardHeight || 1,
        ),
      )
    : 1;
  const fullscreenLift = isFullscreen
    ? Math.min(260, Math.max(150, boardFrameSize.height * 0.22))
    : 0;
  const boardContainerStyle = isFullscreen
    ? {
        height: boardHeight,
        transform: `translateY(-${fullscreenLift}px) scale(${fullscreenScale})`,
        width: boardWidth,
      }
    : {
        height: boardHeight,
        maxWidth: boardWidth,
      };

  return (
    <section
      className={[
        "relative flex min-h-130 flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,#10151F_0%,#10151F_55%,#3A170D_100%)] px-4 py-6 laptop:min-h-131 max-laptop:order-1 max-laptop:min-h-82.5 max-tablet:min-h-72.5 max-tablet:px-2 max-tablet:py-5 max-[340px]:min-h-65",
        isFullscreen ? "min-h-[668px] overflow-visible px-6 py-8 max-laptop:px-4" : "",
      ].join(" ")}
    >
      <RecentMultipliers multipliers={recentMultipliers} />

      <div
        className={[
          "flex flex-1 items-end justify-center max-laptop:items-center",
          isFullscreen ? "items-center overflow-visible max-laptop:items-center" : "",
        ].join(" ")}
        ref={boardFrameRef}
      >
        <div
          className={[
            "relative",
            isFullscreen
              ? "shrink-0 origin-center transition-transform duration-300 ease-out"
              : "w-full",
          ].join(" ")}
          style={boardContainerStyle}
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

type ElementSize = {
  height: number;
  width: number;
};

function useElementSize(ref: React.RefObject<HTMLElement | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ height: 0, width: 0 });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    function updateSize() {
      if (!element) {
        return;
      }

      setSize({
        height: element.clientHeight,
        width: element.clientWidth,
      });
    }

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);

      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
