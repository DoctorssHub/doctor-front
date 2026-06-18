"use client";

import { useMemo, useState } from "react";
import type {
  NewRouletteBet,
  PlacedRouletteBet,
} from "../../model/roulette-bets";
import { BettingNumberGrid } from "./BettingNumberGrid";
import { BettingOutsideBets } from "./BettingOutsideBets";
import { MobileBettingBoard } from "./mobile-betting-board";
import type { HoverArea } from "./betting-board-types";
import {
  buildBetAmountMap,
  isNumberInHoverArea,
} from "./betting-board-utils";

type BettingBoardProps = {
  canUndo: boolean;
  disabled: boolean;
  isFullscreen?: boolean;
  placedBets: PlacedRouletteBet[];
  onClear: () => void;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onUndo: () => void;
};

export function BettingBoard({
  canUndo,
  disabled,
  isFullscreen = false,
  placedBets,
  onClear,
  onPlaceBet,
  onUndo,
}: BettingBoardProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea | null>(null);
  const betAmounts = useMemo(() => buildBetAmountMap(placedBets), [placedBets]);
  const hasActiveHover = hoverArea !== null;
  const isZeroHighlighted = isNumberInHoverArea(0, hoverArea);

  function getHoverHandlers(area: HoverArea) {
    return {
      onBlur: () => setHoverArea(null),
      onFocus: () => setHoverArea(area),
      onMouseEnter: () => setHoverArea(area),
      onMouseLeave: () => setHoverArea(null),
    };
  }

  return (
    <div className="w-full overflow-x-auto max-tablet:overflow-visible">
      <div
        className={[
          "mx-auto max-tablet:hidden",
          isFullscreen
            ? "w-full min-w-0 max-w-none"
            : "min-w-[625px] max-w-[625px] tablet:max-laptop:h-[264px] tablet:max-laptop:min-w-[719px] tablet:max-laptop:max-w-[719px]",
        ].join(" ")}
      >
        <BettingNumberGrid
          betAmounts={betAmounts}
          disabled={disabled}
          hasActiveHover={hasActiveHover}
          hoverArea={hoverArea}
          isFullscreen={isFullscreen}
          isZeroHighlighted={isZeroHighlighted}
          onGetHoverHandlers={getHoverHandlers}
          onPlaceBet={onPlaceBet}
        />
        <BettingOutsideBets
          betAmounts={betAmounts}
          canUndo={canUndo}
          disabled={disabled}
          hoverArea={hoverArea}
          isFullscreen={isFullscreen}
          onClear={onClear}
          onGetHoverHandlers={getHoverHandlers}
          onPlaceBet={onPlaceBet}
          onUndo={onUndo}
        />
      </div>
      <MobileBettingBoard
        betAmounts={betAmounts}
        canUndo={onUndo !== undefined && placedBets.length > 0}
        disabled={disabled}
        hoverArea={hoverArea}
        onClear={onClear}
        onGetHoverHandlers={getHoverHandlers}
        onPlaceBet={onPlaceBet}
        onUndo={onUndo}
      />
    </div>
  );
}
