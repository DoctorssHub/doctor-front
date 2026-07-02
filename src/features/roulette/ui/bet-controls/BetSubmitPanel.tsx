import { memo } from "react";
import { GameBetButton } from "@/shared/ui/game-sidebar";
import { getPlacedBetsTotal } from "../../model/roulette-bets";
import { useRouletteStore } from "../../model/use-roulette-store";
import { formatCoinAmount } from "../../lib/roulette-formatters";

type BetSubmitPanelProps = {
  autoBetCount: string;
  errorMessage: string | null;
  gameBalance: number;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isLoading: boolean;
  maxBet: number;
  minBet: number;
  mode: "manual" | "auto";
  onSubmit: () => void;
};

export const BetSubmitPanel = memo(function BetSubmitPanel({
  autoBetCount,
  errorMessage,
  gameBalance,
  isAutoInfinite,
  isAutoRunning,
  isLoading,
  maxBet,
  minBet,
  mode,
  onSubmit,
}: BetSubmitPanelProps) {
  const totalBetAmount = useRouletteStore((state) =>
    getPlacedBetsTotal(state.placedBets),
  );
  const isBetInvalid =
    totalBetAmount < minBet ||
    totalBetAmount > maxBet ||
    totalBetAmount > gameBalance;
  const normalizedAutoBetCount = Number(autoBetCount);
  const isAutoBetCountInvalid =
    mode === "auto" &&
    !isAutoInfinite &&
    (!Number.isInteger(normalizedAutoBetCount) || normalizedAutoBetCount < 1);
  const isBetDisabled =
    isLoading ||
    (!isAutoRunning && (isBetInvalid || isAutoBetCountInvalid));
  const helperMessage =
    totalBetAmount > gameBalance
      ? "Not enough coins"
      : totalBetAmount > 0 && totalBetAmount < minBet
        ? `Minimum bet is ${formatCoinAmount(minBet)}`
        : totalBetAmount > maxBet
          ? `Maximum bet is ${formatCoinAmount(maxBet)}`
          : isAutoBetCountInvalid
            ? "Enter at least 1 bet"
            : errorMessage;
  const actionLabel = isLoading
    ? "Betting..."
    : isAutoRunning
      ? "Stop Auto"
      : "Bet";

  return (
    <div className="space-y-3">
      <GameBetButton
        disabled={isBetDisabled}
        isLoading={isLoading}
        label={actionLabel}
        onClick={onSubmit}
      />
      {helperMessage ? (
        <p className="min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {helperMessage}
        </p>
      ) : (
        <p className="min-h-5" />
      )}
    </div>
  );
});
