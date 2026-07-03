import { readBetAmount } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { formatDiceNumber } from "../../lib/dice-calculations";
import type { DiceMode } from "../../model/dice-game-options";

type DiceBetControlsValidationParams = {
  autoBetCount: string;
  betAmount: string;
  gameBalance: number;
  helperMessage: string | null;
  isAutoInfinite: boolean;
  maxBet: string;
  minBet: string;
  mode: DiceMode;
};

export function getDiceBetControlsValidation({
  autoBetCount,
  betAmount,
  gameBalance,
  helperMessage,
  isAutoInfinite,
  maxBet,
  minBet,
  mode,
}: DiceBetControlsValidationParams) {
  const parsedBetAmount = readBetAmount(betAmount);
  const parsedAutoBetCount = Number(autoBetCount);
  const isBetAmountInvalid =
    parsedBetAmount === null ||
    parsedBetAmount < Number(minBet) ||
    parsedBetAmount > Number(maxBet) ||
    parsedBetAmount > gameBalance;
  const isAutoBetCountInvalid =
    mode === "auto" &&
    !isAutoInfinite &&
    (!Number.isInteger(parsedAutoBetCount) || parsedAutoBetCount < 1);
  const submitHelperMessage =
    parsedBetAmount !== null && parsedBetAmount > gameBalance
      ? "Not enough coins"
      : parsedBetAmount !== null && parsedBetAmount < Number(minBet)
        ? `Minimum bet is ${formatDiceNumber(Number(minBet))}`
        : parsedBetAmount !== null && parsedBetAmount > Number(maxBet)
          ? `Maximum bet is ${formatDiceNumber(Number(maxBet))}`
          : isAutoBetCountInvalid
            ? "Enter at least 1 bet"
            : helperMessage;

  return {
    isAutoBetCountInvalid,
    isBetAmountInvalid,
    submitHelperMessage,
  };
}
