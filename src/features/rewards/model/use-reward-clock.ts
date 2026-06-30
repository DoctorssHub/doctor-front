"use client";

import { useEffect, useState } from "react";

export function useRewardClock() {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return nowMs;
}
