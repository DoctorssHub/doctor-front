"use client";

import { useEffect, useRef } from "react";

import { getRemainingCountdownSeconds } from "./claim-card-utils";
import type { ClaimCountdownTextProps } from "./types";

export function ClaimCountdownText({
  className,
  endsAtMs,
  formatter,
  onComplete,
}: ClaimCountdownTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;

    function syncCountdownText() {
      const remainingSeconds = getRemainingCountdownSeconds(endsAtMs);

      if (textRef.current) {
        textRef.current.textContent = formatter(remainingSeconds);
      }

      if (remainingSeconds > 0 || completedRef.current) {
        return;
      }

      completedRef.current = true;
      onComplete();
    }

    syncCountdownText();

    const intervalId = window.setInterval(() => {
      syncCountdownText();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endsAtMs, formatter, onComplete]);

  return (
    <span className={className} ref={textRef}>
      {formatter(getRemainingCountdownSeconds(endsAtMs))}
    </span>
  );
}
