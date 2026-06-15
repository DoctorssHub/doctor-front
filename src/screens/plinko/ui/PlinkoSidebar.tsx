"use client";

import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import {
  PlinkoAutoBetSection,
  PlinkoBetAmountControl,
  PlinkoBetButton,
  PlinkoBetError,
  PlinkoModeControl,
  PlinkoRiskControl,
  PlinkoRowsControl,
} from "./sidebar";

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
