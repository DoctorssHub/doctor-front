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
  disabled: boolean;
  placedBets: PlacedRouletteBet[];
  onPlaceBet: (bet: NewRouletteBet) => void;
};

export function BettingBoard({
  disabled,
  placedBets,
  onPlaceBet,
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
    <div className="w-full overflow-x-auto ">
      <div className="mx-auto min-w-[625px] max-w-[625px]">
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
          disabled={disabled}
          hoverArea={hoverArea}
          onGetHoverHandlers={getHoverHandlers}
          onPlaceBet={onPlaceBet}
        />
      </div>
    </div>
  );
}
