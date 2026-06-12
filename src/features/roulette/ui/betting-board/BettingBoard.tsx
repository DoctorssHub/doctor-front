"use client";

import { useMemo, useState } from "react";
import type {
  NewRouletteBet,
  PlacedRouletteBet,
} from "../../model/roulette-bets";
import { BettingNumberGrid } from "./BettingNumberGrid";
import { BettingOutsideBets } from "./BettingOutsideBets";
import type { HoverArea } from "./betting-board-types";
import {
  buildBetAmountMap,
  isNumberInHoverArea,
} from "./betting-board-utils";

type BettingBoardProps = {
  canUndo: boolean;
  disabled: boolean;
  placedBets: PlacedRouletteBet[];
  onClear: () => void;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onUndo: () => void;
};

export function BettingBoard({
  canUndo,
  disabled,
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
    <div className="w-full overflow-x-auto">
      <div className="mx-auto min-w-[625px] max-w-[625px] tablet:max-laptop:h-[264px] tablet:max-laptop:min-w-[719px] tablet:max-laptop:max-w-[719px] ">
        <BettingNumberGrid
          betAmounts={betAmounts}
          disabled={disabled}
          hasActiveHover={hasActiveHover}
          hoverArea={hoverArea}
          isZeroHighlighted={isZeroHighlighted}
          onGetHoverHandlers={getHoverHandlers}
          onPlaceBet={onPlaceBet}
        />
        <BettingOutsideBets
          betAmounts={betAmounts}
          canUndo={canUndo}
          disabled={disabled}
          hoverArea={hoverArea}
          onClear={onClear}
          onGetHoverHandlers={getHoverHandlers}
          onPlaceBet={onPlaceBet}
          onUndo={onUndo}
        />
      </div>
    </div>
  );
}
