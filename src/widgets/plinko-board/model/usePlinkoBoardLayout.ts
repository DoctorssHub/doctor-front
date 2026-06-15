"use client";

import { useSyncExternalStore } from "react";
import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";

const NARROW_VIEWPORT_MAX_WIDTH = 340;
const fallbackBreakpoints = {
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

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
  const breakpoints = getThemeBreakpoints();

  if (width <= NARROW_VIEWPORT_MAX_WIDTH) {
    return "narrow";
  }

  if (width < breakpoints.tablet) {
    return "compact";
  }

  if (width < breakpoints.laptop) {
    return "tablet";
  }

  if (width < breakpoints.desktop) {
    return "laptop";
  }

  return "regular";
}

function getThemeBreakpoints() {
  if (typeof window === "undefined") {
    return fallbackBreakpoints;
  }

  const styles = window.getComputedStyle(document.documentElement);

  return {
    tablet: readCssLength(styles, "--breakpoint-tablet", fallbackBreakpoints.tablet),
    laptop: readCssLength(styles, "--breakpoint-laptop", fallbackBreakpoints.laptop),
    desktop: readCssLength(styles, "--breakpoint-desktop", fallbackBreakpoints.desktop),
  };
}

function readCssLength(
  styles: CSSStyleDeclaration,
  property: string,
  fallback: number,
) {
  const value = styles.getPropertyValue(property).trim();

  if (!value) {
    return fallback;
  }

  if (value.endsWith("rem")) {
    const rootFontSize = Number.parseFloat(styles.fontSize) || 16;
    const remValue = Number.parseFloat(value);

    return Number.isFinite(remValue) ? remValue * rootFontSize : fallback;
  }

  if (value.endsWith("px")) {
    const pxValue = Number.parseFloat(value);

    return Number.isFinite(pxValue) ? pxValue : fallback;
  }

  return fallback;
}

export function usePlinkoBoardLayout(): BoardLayout {
  const viewportWidth = useSyncExternalStore(
    subscribeToViewportWidth,
    getViewportWidthSnapshot,
    getServerViewportWidthSnapshot,
  );

  return getLayoutForViewportWidth(viewportWidth);
}
