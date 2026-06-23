import type { KenoTileState } from "./KenoTile";

type KenoTileStateParams = {
  isRevealedMiss: boolean;
  isRevealedResult: boolean;
  isRoundSelected: boolean;
  isSelected: boolean;
};

export function getKenoTileState({
  isRevealedMiss,
  isRevealedResult,
  isRoundSelected,
  isSelected,
}: KenoTileStateParams): KenoTileState {
  if (isRoundSelected && isRevealedResult) {
    return "hit";
  }

  if (isRevealedMiss) {
    return "miss";
  }

  if (isRevealedResult) {
    return "result";
  }

  return isSelected ? "selected" : "default";
}
