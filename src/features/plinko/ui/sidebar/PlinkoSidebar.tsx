"use client";

import { GameSidebar } from "@/shared/ui/game-sidebar/ui/GameSidebar";
import { PlinkoAutoBetSection } from "./PlinkoAutoBetSection";
import { PlinkoBetAmountControl } from "./PlinkoBetAmountControl";
import { PlinkoBetButton } from "./PlinkoBetButton";
import { PlinkoBetError } from "./PlinkoBetError";
import { PlinkoModeControl } from "./PlinkoModeControl";
import { PlinkoRiskControl } from "./PlinkoRiskControl";
import { PlinkoRowsControl } from "./PlinkoRowsControl";

export type PlinkoSidebarProps = {
  configErrorMessage?: string;
  hasGameConfigError: boolean;
  isGameConfigLoading: boolean;
  isGameConfigReady: boolean;
  maxBet: string;
  minBet: string;
};

export type PlinkoGameConfigStatusProps = Pick<
  PlinkoSidebarProps,
  "hasGameConfigError" | "isGameConfigLoading" | "isGameConfigReady"
>;

export type PlinkoBetBoundsProps = Pick<
  PlinkoSidebarProps,
  "maxBet" | "minBet"
>;

export function PlinkoSidebar({
  configErrorMessage,
  hasGameConfigError,
  isGameConfigLoading,
  isGameConfigReady,
  maxBet,
  minBet,
}: PlinkoSidebarProps) {
  return (
    <GameSidebar>
      <PlinkoModeControl />
      <PlinkoBetAmountControl maxBet={maxBet} minBet={minBet} />
      <PlinkoRiskControl />
      <PlinkoRowsControl />
      <PlinkoAutoBetSection />
      <PlinkoBetButton
        hasGameConfigError={hasGameConfigError}
        isGameConfigLoading={isGameConfigLoading}
        isGameConfigReady={isGameConfigReady}
        maxBet={maxBet}
        minBet={minBet}
      />
      <PlinkoBetError configErrorMessage={configErrorMessage} />
    </GameSidebar>
  );
}
