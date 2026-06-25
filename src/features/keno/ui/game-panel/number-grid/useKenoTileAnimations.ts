import { useCallback, useEffect, useRef } from "react";
import {
  KENO_TILE_SCALE_ANIMATION_OPTIONS,
  KENO_TILE_SCALE_KEYFRAMES,
} from "./keno-tile-animation";

type UseKenoTileAnimationsParams = {
  autoPickingNumber: number | null;
  revealedMissNumbers: number[];
  revealedResultNumbers: number[];
};

export function useKenoTileAnimations({
  autoPickingNumber,
  revealedMissNumbers,
  revealedResultNumbers,
}: UseKenoTileAnimationsParams) {
  const tileRefs = useRef(new Map<number, HTMLButtonElement>());

  function animateTileByNumber(number: number | undefined) {
    if (number === undefined) {
      return;
    }

    animateTile(tileRefs.current.get(number));
  }

  useEffect(() => {
    if (autoPickingNumber === null) {
      return;
    }

    animateTile(tileRefs.current.get(autoPickingNumber));
  }, [autoPickingNumber]);

  useEffect(() => {
    animateTileByNumber(revealedResultNumbers.at(-1));
  }, [revealedResultNumbers]);

  useEffect(() => {
    animateTileByNumber(revealedMissNumbers.at(-1));
  }, [revealedMissNumbers]);

  const setTileRef = useCallback(
    (number: number, element: HTMLButtonElement | null) => {
      if (element) {
        tileRefs.current.set(number, element);
        return;
      }

      tileRefs.current.delete(number);
    },
    [],
  );

  return {
    setTileRef,
  };
}

function animateTile(element: HTMLButtonElement | undefined) {
  element?.animate(
    KENO_TILE_SCALE_KEYFRAMES,
    KENO_TILE_SCALE_ANIMATION_OPTIONS,
  );
}
