"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import type { DiceBetRequest, DiceBetResponse } from "../api/dice-types";
import { runDiceAutoBetSequence } from "../lib/dice-auto-betting";
import {
  DEFAULT_DICE_AUTO_CONFIG,
  type DiceAutoConfig,
  type DiceMode,
} from "../model/dice-game-options";

const AUTO_BET_COUNT_DEFAULT = "10";

type UseDiceAutoBettingParams = {
  isValidBetSize: (betSize: number, balance: number) => boolean;
  mutateBet: (payload: DiceBetRequest) => Promise<DiceBetResponse>;
};

type RunAutoBetsParams = {
  config: DiceAutoConfig;
  initialBalance: number;
  initialBetSize: number;
  isInfinite: boolean;
  plannedBets: number;
  payload: DiceBetRequest;
};

export function useDiceAutoBetting({
  isValidBetSize,
  mutateBet,
}: UseDiceAutoBettingParams) {
  const shouldStopAutoRef = useRef(false);
  const autoBetCountRef = useRef(AUTO_BET_COUNT_DEFAULT);
  const modeRef = useRef<DiceMode>("manual");
  const [isAutoInfinite, setIsAutoInfinite] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isAutoStopRequested, setIsAutoStopRequested] = useState(false);
  const [autoConfig, setAutoConfig] = useState<DiceAutoConfig>(
    DEFAULT_DICE_AUTO_CONFIG,
  );
  const [isAutoConfigOpen, setIsAutoConfigOpen] = useState(false);

  useEffect(() => {
    return () => {
      shouldStopAutoRef.current = true;
    };
  }, []);

  const getAutoBetCount = useCallback(() => autoBetCountRef.current, []);
  const getMode = useCallback(() => modeRef.current, []);

  const handleAutoBetCountChange = useCallback((amount: string) => {
    autoBetCountRef.current = amount;
  }, []);

  const handleModeChange = useCallback((nextMode: DiceMode) => {
    modeRef.current = nextMode;
  }, []);

  const requestAutoStop = useCallback(() => {
    shouldStopAutoRef.current = true;
    setIsAutoStopRequested(true);
  }, []);

  const runAutoBets = useCallback(async ({
    config,
    initialBalance,
    initialBetSize,
    isInfinite,
    plannedBets,
    payload,
  }: RunAutoBetsParams) => {
    shouldStopAutoRef.current = false;
    setIsAutoRunning(true);
    setIsAutoStopRequested(false);

    try {
      await runDiceAutoBetSequence({
        config,
        initialBalance,
        initialBetSize,
        isInfinite,
        isValidBetSize,
        mutateBet,
        onBetStart: () => gameSounds.playBetStart("dice"),
        payload,
        plannedBets,
        shouldStop: () => shouldStopAutoRef.current,
      });
    } finally {
      shouldStopAutoRef.current = false;
      setIsAutoRunning(false);
      setIsAutoStopRequested(false);
    }
  }, [isValidBetSize, mutateBet]);

  const handleAutoConfigApply = useCallback(() => {
    setIsAutoConfigOpen(false);
  }, []);

  const handleAutoConfigClose = useCallback(() => {
    setIsAutoConfigOpen(false);
  }, []);

  const handleAutoConfigOpen = useCallback(() => {
    setIsAutoConfigOpen(true);
  }, []);

  const handleAutoConfigResetAll = useCallback(() => {
    setAutoConfig(DEFAULT_DICE_AUTO_CONFIG);
  }, []);

  const handleToggleAutoInfinite = useCallback(() => {
    setIsAutoInfinite((current) => !current);
  }, []);

  return useMemo(() => ({
    autoConfig,
    getAutoBetCount,
    getMode,
    isAutoConfigOpen,
    isAutoInfinite,
    isAutoRunning,
    isAutoStopRequested,
    onAutoBetCountChange: handleAutoBetCountChange,
    onAutoConfigApply: handleAutoConfigApply,
    onAutoConfigChange: setAutoConfig,
    onAutoConfigClose: handleAutoConfigClose,
    onAutoConfigOpen: handleAutoConfigOpen,
    onAutoConfigResetAll: handleAutoConfigResetAll,
    onModeChange: handleModeChange,
    onToggleAutoInfinite: handleToggleAutoInfinite,
    requestAutoStop,
    runAutoBets,
  }), [
    autoConfig,
    getAutoBetCount,
    getMode,
    handleAutoBetCountChange,
    handleAutoConfigApply,
    handleAutoConfigClose,
    handleAutoConfigOpen,
    handleAutoConfigResetAll,
    handleModeChange,
    handleToggleAutoInfinite,
    isAutoConfigOpen,
    isAutoInfinite,
    isAutoRunning,
    isAutoStopRequested,
    requestAutoStop,
    runAutoBets,
  ]);
}
