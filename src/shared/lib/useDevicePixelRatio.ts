"use client";

import { useSyncExternalStore } from "react";

function getDevicePixelRatioSnapshot() {
  if (typeof window === "undefined") {
    return 1;
  }

  return window.devicePixelRatio || 1;
}

function subscribeToDevicePixelRatio(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQueryList = window.matchMedia(
    `(resolution: ${getDevicePixelRatioSnapshot()}dppx)`,
  );

  window.addEventListener("resize", onStoreChange);
  mediaQueryList.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
    mediaQueryList.removeEventListener("change", onStoreChange);
  };
}

export function useDevicePixelRatio() {
  return useSyncExternalStore(
    subscribeToDevicePixelRatio,
    getDevicePixelRatioSnapshot,
    () => 1,
  );
}
