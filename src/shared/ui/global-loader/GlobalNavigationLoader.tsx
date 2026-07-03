"use client";

import { useEffect } from "react";
import { GlobalLoader } from "./GlobalLoader";
import { useLoaderPhase } from "./useLoaderPhase";

export function GlobalNavigationLoader() {
  const phase = useLoaderPhase();

  useEffect(() => {
    document.documentElement.dataset.loaderPhase = phase;
    window.dispatchEvent(
      new CustomEvent("global-loader-phase-change", {
        detail: { phase },
      }),
    );
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }

  return <GlobalLoader isExiting={phase === "exiting"} />;
}
