"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { GlobalLoader } from "./GlobalLoader";
import { useLoaderPhase } from "./useLoaderPhase";

export function GlobalNavigationLoader() {
  const phase = useLoaderPhase();
  const portalRoot = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    document.documentElement.dataset.loaderPhase = phase;
    window.dispatchEvent(
      new CustomEvent("global-loader-phase-change", {
        detail: { phase },
      }),
    );
  }, [phase]);

  if (phase === "hidden" || portalRoot === null) {
    return null;
  }

  return createPortal(
    <GlobalLoader isExiting={phase === "exiting"} />,
    portalRoot,
  );
}
