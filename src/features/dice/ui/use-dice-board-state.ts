"use client";

import { useCallback, useMemo, useState } from "react";
import type { DiceBetRequest } from "../api/dice-types";
import {
  clampDiceThreshold,
  formatDiceNumber,
  getDiceChance,
  getDiceChanceFromMultiplier,
  getDiceMultiplier,
  getDiceThresholdFromChance,
} from "../lib/dice-calculations";

type UseDiceBoardStateParams = {
  maxMultiplier: number;
  rtp: number;
};

export function useDiceBoardState({
  maxMultiplier,
  rtp,
}: UseDiceBoardStateParams) {
  const [threshold, setThreshold] = useState(55.55);
  const [above, setAbove] = useState(true);
  const chance = getDiceChance(threshold, above);
  const multiplier = getDiceMultiplier(chance, rtp, maxMultiplier);

  const handleThresholdChange = useCallback((nextThreshold: number) => {
    setThreshold(clampDiceThreshold(nextThreshold));
  }, []);

  const handleAboveChange = useCallback((nextAbove: boolean) => {
    setThreshold((currentThreshold) =>
      nextAbove === above
        ? currentThreshold
        : clampDiceThreshold(100 - currentThreshold),
    );
    setAbove(nextAbove);
  }, [above]);

  const handleMultiplierChange = useCallback((nextMultiplier: number) => {
    const nextChance = getDiceChanceFromMultiplier(
      nextMultiplier,
      rtp,
      maxMultiplier,
    );

    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }, [above, maxMultiplier, rtp]);

  const handleChanceChange = useCallback((nextChance: number) => {
    setThreshold(getDiceThresholdFromChance(nextChance, above));
  }, [above]);

  const getBetPayload = useCallback((betSize: number): DiceBetRequest => ({
    above,
    betSize: formatDiceNumber(betSize),
    threshold: Number(formatDiceNumber(threshold)),
  }), [above, threshold]);

  return useMemo(() => ({
    above,
    chance,
    getBetPayload,
    multiplier,
    threshold,
    onAboveChange: handleAboveChange,
    onChanceChange: handleChanceChange,
    onMultiplierChange: handleMultiplierChange,
    onThresholdChange: handleThresholdChange,
  }), [
    above,
    chance,
    getBetPayload,
    handleAboveChange,
    handleChanceChange,
    handleMultiplierChange,
    handleThresholdChange,
    multiplier,
    threshold,
  ]);
}