"use client";

import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
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
  isFullscreen?: boolean;
  isInteractionLocked: boolean;
  isRevealingResults: boolean;
  onResultsReset: () => void;
  onRevealComplete: () => void;
  resultNumbers: number[];
  resultRoundId: number;
  roundSelectedNumbers: number[];
};

export const KenoNumberGrid = memo(function KenoNumberGrid({
  isFullscreen = false,
  isInteractionLocked,
  isRevealingResults,
  onResultsReset,
  onRevealComplete,
  resultNumbers,
  resultRoundId,
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
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const { revealedMissNumbers, revealedResultNumbers } = useKenoRevealSequence({
    isTurboModeEnabled,
    onRevealComplete,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
  });
  const { setTileRef } = useKenoTileAnimations({
    autoPickingNumber,
    revealedMissNumbers,
    revealedResultNumbers,
  });
  function handleSelectNumber(number: number) {
    gameSounds.playSelection();
    toggleNumber(number);
  }

  const selectedNumbersCount = selectedNumbers.length;
  const hasSettledResults = resultNumbers.length > 0 && !isRevealingResults;
  const multipliers =
    KENO_MULTIPLIERS[risk][selectedNumbersCount] ?? EMPTY_KENO_MULTIPLIERS;
  const contentWidthClassName = isFullscreen
    ? "max-w-[min(720px,calc(100vh_-_220px),100%)]"
    : "max-w-[578px]";
  const compactWidthClassName = isFullscreen ? "" : "max-[768px]:max-w-none";

  return (
    <section
      className={[
        "flex min-w-0 flex-col bg-[linear-gradient(180deg,#10151F_0%,#10151F_55%,#3A170D_100%)] px-[43px] pt-11 max-[1023px]:order-1 max-[1023px]:items-center max-[1023px]:px-5 max-[1023px]:pt-[84px] max-[1023px]:pb-[84px] max-[480px]:px-4 max-[480px]:pt-10 max-[480px]:pb-10",
        isFullscreen ? "items-center justify-center px-5 py-11" : "",
        isAutoPicking ? "pointer-events-none" : "",
      ].join(" ")}
      onClickCapture={(event) => {
        if (!hasSettledResults) {
          return;
        }

        event.stopPropagation();
        onResultsReset();
      }}
    >
      <div
        className={[
          "grid w-full grid-cols-8 gap-1.5 max-[480px]:gap-[3px]",
          contentWidthClassName,
          compactWidthClassName,
        ].join(" ")}
      >
        {KENO_NUMBERS.map((number) => {
          const state = getKenoTileState({
            isRevealedMiss: revealedMissNumbers.includes(number),
            isRevealedResult: revealedResultNumbers.includes(number),
            isRoundSelected: roundSelectedNumbers.includes(number),
            isSelected: selectedNumbers.includes(number),
          });

          return (
            <KenoTile
              disabled={isInteractionLocked}
              key={number}
              number={number}
              onSelect={handleSelectNumber}
              setTileRef={setTileRef}
              state={state}
            />
          );
        })}
      </div>
      <KenoMultiplierPanel
        className={[contentWidthClassName, compactWidthClassName].join(" ")}
        multipliers={multipliers}
        selectedNumbersCount={selectedNumbersCount}
      />
    </section>
  );
});
