"use client";

import { GlobalLoader } from "./GlobalLoader";
import { useLoaderPhase } from "./useLoaderPhase";

export function GlobalNavigationLoader() {
  const phase = useLoaderPhase();

  if (phase === "hidden") {
    return null;
  }

  return <GlobalLoader isExiting={phase === "exiting"} />;
}
