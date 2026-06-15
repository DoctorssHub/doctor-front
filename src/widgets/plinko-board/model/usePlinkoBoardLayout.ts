"use client";

import { useSyncExternalStore } from "react";
import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";

function subscribeToViewportWidth(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const frameId = window.requestAnimationFrame(onStoreChange);

  window.addEventListener("resize", onStoreChange);

  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getViewportWidthSnapshot() {
  if (typeof window === "undefined") {
    return Number.POSITIVE_INFINITY;
  }

  return window.innerWidth;
}

function getServerViewportWidthSnapshot() {
  return Number.POSITIVE_INFINITY;
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
    getServerViewportWidthSnapshot,
  );

  return getLayoutForViewportWidth(viewportWidth);
}
