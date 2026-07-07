"use client";

import { memo } from "react";
import { getTurboTimingScale } from "@/shared/lib/turbo-mode";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import { RouletteBall } from "./RouletteBall";
import { RouletteWheelCenter } from "./RouletteWheelCenter";
import { RouletteWheelImageLayer } from "./RouletteWheelImageLayer";
import { RouletteWheelShell } from "./RouletteWheelShell";
import { useRouletteWheelAnimation } from "./useRouletteWheelAnimation";

type RouletteWheelProps = {
  isSpinning: boolean;
  onLandingComplete?: () => void;
  resultNumber: number | null;
};

export const RouletteWheel = memo(function RouletteWheel({
  isSpinning,
  onLandingComplete,
  resultNumber,
}: RouletteWheelProps) {
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const timingScale = getTurboTimingScale("roulette", isTurboModeEnabled);
  const { ballRef, centerRef, initialBallTransform, wheelRef } =
    useRouletteWheelAnimation({
      isSpinning,
      onLandingComplete,
      resultNumber,
      timingScale,
    });

  return (
    <RouletteWheelShell>
      <RouletteWheelImageLayer wheelRef={wheelRef} />
      <RouletteWheelCenter centerRef={centerRef} />
      <RouletteBall
        ballRef={ballRef}
        initialTransform={initialBallTransform}
      />
    </RouletteWheelShell>
  );
});
