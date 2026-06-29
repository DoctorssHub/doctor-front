"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useGameFullscreen() {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const target = fullscreenRef.current;

    if (!target) {
      return;
    }

    try {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
        return;
      }

      await target.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  }, []);

  return {
    fullscreenRef,
    isFullscreen,
    toggleFullscreen,
  };
}
