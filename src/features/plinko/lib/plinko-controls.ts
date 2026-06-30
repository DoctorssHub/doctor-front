import type { GameMode } from "@/entities/game/model/types";

type BetButtonLabelParams = {
  hasConfigError?: boolean;
  isAuthenticated?: boolean;
  isAutoBetStopRequested?: boolean;
  isAutoBetting?: boolean;
  isBetting?: boolean;
  isConfigLoading?: boolean;
  mode?: GameMode;
};

type FiniteAutoBetBudgetParams = {
  amount: number;
  autoBetsCount: number;
  availableBalance: number | null;
};

export function getBetButtonLabel({
  hasConfigError = false,
  isAuthenticated = false,
  isAutoBetStopRequested = false,
  isAutoBetting = false,
  isBetting = false,
  isConfigLoading = false,
  mode = "Manual",
}: BetButtonLabelParams) {
  if (!isAuthenticated) {
    return "Login to bet";
  }

  if (isConfigLoading) {
    return "Loading game...";
  }

  if (hasConfigError) {
    return "Game unavailable";
  }

  if (isAutoBetting) {
    return isAutoBetStopRequested ? "Stopping..." : "Stop Autobet";
  }

  if (mode === "Auto") {
    return "Start Autobet";
  }

  if (isBetting) {
    return "Betting...";
  }

  return "Bet";
}

export function validateFiniteAutoBetBudget({
  amount,
  autoBetsCount,
  availableBalance,
}: FiniteAutoBetBudgetParams) {
  if (availableBalance === null) {
    return "";
  }

  return amount * autoBetsCount > availableBalance
    ? `Not enough balance for ${autoBetsCount} auto bets.`
    : "";
}
