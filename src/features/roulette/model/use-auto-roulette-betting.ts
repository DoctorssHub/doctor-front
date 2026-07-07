import { useCallback, useRef, useState } from "react";
import { getTurboAutoBetDelay } from "@/shared/lib/turbo-mode";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { sanitizeIntegerInput } from "@/shared/ui/game-sidebar/lib/numeric-input";
import type { RouletteBetRequest } from "../api/roulette-types";

const AUTO_BET_COUNT_DEFAULT = "10";
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
  const autoBetCountRef = useRef(AUTO_BET_COUNT_DEFAULT);
  const isAutoRunningRef = useRef(false);
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const nextSpinDelayMs = getTurboAutoBetDelay(
    "roulette",
    AUTO_NEXT_SPIN_DELAY_MS,
    isTurboModeEnabled,
  );

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

  const handleAutoBetCountChange = useCallback((value: string) => {
    autoBetCountRef.current = sanitizeIntegerInput(value);
  }, []);

  const handleToggleAutoInfinite = useCallback(() => {
    setIsAutoInfinite((currentValue) => !currentValue);
  }, []);

  const startAutoBetting = useCallback((payload: RouletteBetRequest) => {
    const normalizedAutoBetCount = Number(autoBetCountRef.current);

    autoPayloadRef.current = payload;
    autoRemainingRef.current = isAutoInfinite ? Infinity : normalizedAutoBetCount;
    isAutoRunningRef.current = true;
    setIsAutoRunning(true);

    return {
      clearBetsOnSuccess: false,
      payload,
    } satisfies AutoRouletteBetVariables;
  }, [isAutoInfinite]);

  const scheduleNextAutoBet = useCallback((scheduleAutoBet: ScheduleAutoBet) => {
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
    }, nextSpinDelayMs);
  }, [isAutoInfinite, nextSpinDelayMs, stopAutoBetting]);

  return {
    handleAutoBetCountChange,
    handleToggleAutoInfinite,
    isAutoInfinite,
    isAutoRunning,
    scheduleNextAutoBet,
    startAutoBetting,
    stopAutoBetting,
  };
}
