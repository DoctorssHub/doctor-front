import { useCallback, useRef, useState } from "react";
import { sanitizeIntegerInput } from "@/widgets/game-sidebar/lib/numeric-input";
import type { RouletteBetRequest } from "../api/roulette-types";

const AUTO_NEXT_SPIN_DELAY_MS = 6200;

type AutoRouletteBetVariables = {
  clearBetsOnSuccess: false;
  payload: RouletteBetRequest;
};

type ScheduleAutoBet = (variables: AutoRouletteBetVariables) => void;

export function useAutoRouletteBetting() {
  const autoPayloadRef = useRef<RouletteBetRequest | null>(null);
  const autoRemainingRef = useRef(0);
  const autoTimeoutRef = useRef<number | null>(null);
  const isAutoRunningRef = useRef(false);
  const [autoBetCount, setAutoBetCount] = useState("10");
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const clearAutoTimeout = useCallback(() => {
    if (autoTimeoutRef.current !== null) {
      window.clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
  }, []);

  const stopAutoBetting = useCallback(() => {
    isAutoRunningRef.current = false;
    autoRemainingRef.current = 0;
    autoPayloadRef.current = null;
    clearAutoTimeout();
    setIsAutoRunning(false);
  }, [clearAutoTimeout]);

  function handleAutoBetCountChange(value: string) {
    setAutoBetCount(sanitizeIntegerInput(value));
  }

  function handleToggleAutoInfinite() {
    setIsAutoInfinite((currentValue) => !currentValue);
  }

  function startAutoBetting(payload: RouletteBetRequest) {
    const normalizedAutoBetCount = Number(autoBetCount);

    autoPayloadRef.current = payload;
    autoRemainingRef.current = isAutoInfinite ? Infinity : normalizedAutoBetCount;
    isAutoRunningRef.current = true;
    setIsAutoRunning(true);

    return {
      clearBetsOnSuccess: false,
      payload,
    } satisfies AutoRouletteBetVariables;
  }

  function scheduleNextAutoBet(scheduleAutoBet: ScheduleAutoBet) {
    if (!isAutoRunningRef.current || !autoPayloadRef.current) {
      return;
    }

    if (!isAutoInfinite) {
      autoRemainingRef.current -= 1;
    }

    if (!isAutoInfinite && autoRemainingRef.current <= 0) {
      stopAutoBetting();

      return;
    }

    autoTimeoutRef.current = window.setTimeout(() => {
      if (!isAutoRunningRef.current || !autoPayloadRef.current) {
        return;
      }

      scheduleAutoBet({
        clearBetsOnSuccess: false,
        payload: autoPayloadRef.current,
      });
    }, AUTO_NEXT_SPIN_DELAY_MS);
  }

  return {
    autoBetCount,
    handleAutoBetCountChange,
    handleToggleAutoInfinite,
    isAutoInfinite,
    isAutoRunning,
    scheduleNextAutoBet,
    startAutoBetting,
    stopAutoBetting,
  };
}
