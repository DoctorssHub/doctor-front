"use client";

import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { KENO_NUMBERS } from "../../../model/keno-constants";
import { useKenoControlsStore } from "../../../model/keno-controls-store";
import { KENO_MULTIPLIERS } from "../../../model/keno-multipliers";
import { getKenoTileState } from "./keno-tile-state";
import { KenoMultiplierPanel } from "./KenoMultiplierPanel";
import { KenoTile } from "./KenoTile";
import { useKenoRevealSequence } from "./useKenoRevealSequence";
import { useKenoTileAnimations } from "./useKenoTileAnimations";

const EMPTY_KENO_MULTIPLIERS: number[] = [];

type KenoNumberGridProps = {
  isInteractionLocked: boolean;
  isRevealingResults: boolean;
  onResultsReset: () => void;
  onRevealComplete: () => void;
  resultNumbers: number[];
  roundSelectedNumbers: number[];
};

export const KenoNumberGrid = memo(function KenoNumberGrid({
  isInteractionLocked,
  isRevealingResults,
  onResultsReset,
  onRevealComplete,
  resultNumbers,
  roundSelectedNumbers,
}: KenoNumberGridProps) {
  const {
    autoPickingNumber,
    isAutoPicking,
    risk,
    selectedNumbers,
    toggleNumber,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoPickingNumber: state.autoPickingNumber,
      isAutoPicking: state.isAutoPicking,
      risk: state.risk,
      selectedNumbers: state.selectedNumbers,
      toggleNumber: state.toggleNumber,
    })),
  );
  const { revealedMissNumbers, revealedResultNumbers } = useKenoRevealSequence({
    onRevealComplete,
    resultNumbers,
    roundSelectedNumbers,
  });
  const { setTileRef } = useKenoTileAnimations({
    autoPickingNumber,
    revealedMissNumbers,
    revealedResultNumbers,
  });
  const selectedNumbersCount = selectedNumbers.length;
  const hasSettledResults = resultNumbers.length > 0 && !isRevealingResults;
  const multipliers =
    KENO_MULTIPLIERS[risk][selectedNumbersCount] ?? EMPTY_KENO_MULTIPLIERS;

  return (
    <section
      className="flex min-w-0 flex-col bg-[#0e1519] px-[43px] pt-11 max-[1023px]:order-1 max-[1023px]:items-center max-[1023px]:px-5 max-[1023px]:pt-[84px] max-[1023px]:pb-[84px] max-[767px]:px-4 max-[767px]:pt-10 max-[767px]:pb-10"
      onClickCapture={(event) => {
        if (!hasSettledResults) {
          return;
        }

        event.stopPropagation();
        onResultsReset();
      }}
    >
      <div className="grid w-fit grid-cols-8 gap-1.5 max-[767px]:gap-[3px]">
        {KENO_NUMBERS.map((number) => {
          const state = getKenoTileState({
            isRevealedMiss: revealedMissNumbers.includes(number),
            isRevealedResult: revealedResultNumbers.includes(number),
            isRoundSelected: roundSelectedNumbers.includes(number),
            isSelected: selectedNumbers.includes(number),
          });

          return (
            <KenoTile
              disabled={isAutoPicking || isInteractionLocked}
              key={number}
              number={number}
              onSelect={toggleNumber}
              setTileRef={setTileRef}
              state={state}
            />
          );
        })}
      </div>
      <KenoMultiplierPanel
        multipliers={multipliers}
        selectedNumbersCount={selectedNumbersCount}
      />
    </section>
  );
});
