"use client";

import { useSyncExternalStore } from "react";
import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";

function subscribeToViewportWidth(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("resize", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
  };
}

function getViewportWidthSnapshot() {
  if (typeof window === "undefined") {
    return Number.POSITIVE_INFINITY;
  }

  return window.innerWidth;
}

function getLayoutForViewportWidth(width: number): BoardLayout {
  if (width <= 340) {
    return "narrow";
  }

  if (width <= 767) {
    return "compact";
  }

  if (width <= 1023) {
    return "tablet";
  }

  if (width <= 1279) {
    return "laptop";
  }

  return "regular";
}

export function usePlinkoBoardLayout(): BoardLayout {
  const viewportWidth = useSyncExternalStore(
    subscribeToViewportWidth,
    getViewportWidthSnapshot,
    getViewportWidthSnapshot,
  );

  return getLayoutForViewportWidth(viewportWidth);
}
