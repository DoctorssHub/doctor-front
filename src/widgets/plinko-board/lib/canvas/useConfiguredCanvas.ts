"use client";

import { useEffect, type RefObject } from "react";
import { configureCanvas } from "./drawing";

type UseConfiguredCanvasParams = {
  height: number;
  onCleanup?: () => void;
  onConfigured?: (context: CanvasRenderingContext2D) => void;
  pixelRatio: number;
  ref: RefObject<HTMLCanvasElement | null>;
  width: number;
};

export function useConfiguredCanvas({
  height,
  onCleanup,
  onConfigured,
  pixelRatio,
  ref,
  width,
}: UseConfiguredCanvasParams) {
  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) {
      return;
    }

    const context = configureCanvas(canvas, {
      height,
      pixelRatio,
      width,
    });

    if (!context) {
      return;
    }

    onConfigured?.(context);

    return onCleanup;
  }, [height, onCleanup, onConfigured, pixelRatio, ref, width]);
}
