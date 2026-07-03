import { useCallback, useMemo, useState } from "react";
import {
  formatBetAmountInput,
  getNextBetAmount,
} from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import type { BetAmountControl } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { sanitizeIntegerInput } from "@/shared/ui/game-sidebar/lib/numeric-input";
import { getDiceProfitOnWin } from "../../lib/dice-calculations";
import type { DiceMode } from "../../model/dice-game-options";
import { getDiceBetControlsValidation } from "./dice-bet-controls-validation";

type UseDiceBetControlsFormParams = {
  gameBalance: number;
  helperMessage: string | null;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isAutoStopRequested: boolean;
  maxBet: string;
  minBet: string;
  multiplier: number;
  onAutoBetCountChange: (amount: string) => void;
  onBetAmountChange: (amount: string) => void;
  onModeChange: (mode: DiceMode) => void;
};

export function useDiceBetControlsForm({
  gameBalance,
  helperMessage,
  isAutoInfinite,
  isAutoRunning,
  isAutoStopRequested,
  maxBet,
  minBet,
  multiplier,
  onAutoBetCountChange,
  onBetAmountChange,
  onModeChange,
}: UseDiceBetControlsFormParams) {
  const [autoBetCount, setAutoBetCount] = useState("10");
  const [betAmount, setBetAmount] = useState("10.00");
  const [mode, setMode] = useState<DiceMode>("manual");

  const handleModeChange = useCallback((nextMode: DiceMode) => {
    setMode(nextMode);
    onModeChange(nextMode);
  }, [onModeChange]);

  const handleAutoBetCountChange = useCallback((amount: string) => {
    const nextAutoBetCount = sanitizeIntegerInput(amount);

    setAutoBetCount(nextAutoBetCount);
    onAutoBetCountChange(nextAutoBetCount);
  }, [onAutoBetCountChange]);

  const handleBetAmountBlur = useCallback(() => {
    const nextBetAmount = formatBetAmountInput(betAmount);

    setBetAmount(nextBetAmount);
    onBetAmountChange(nextBetAmount);
  }, [betAmount, onBetAmountChange]);

  const handleBetAmountChange = useCallback((amount: string) => {
    setBetAmount(amount);
    onBetAmountChange(amount);
  }, [onBetAmountChange]);

  const handleBetAmountControlClick = useCallback((control: BetAmountControl) => {
    const nextBetAmount = getNextBetAmount(betAmount, control, {
      availableBalance: gameBalance,
      maxBet,
      minBet,
    });

    setBetAmount(nextBetAmount);
    onBetAmountChange(nextBetAmount);
  }, [betAmount, gameBalance, maxBet, minBet, onBetAmountChange]);

  const validation = useMemo(() => getDiceBetControlsValidation({
    autoBetCount,
    betAmount,
    gameBalance,
    helperMessage,
    isAutoInfinite,
    maxBet,
    minBet,
    mode,
  }), [
    autoBetCount,
    betAmount,
    gameBalance,
    helperMessage,
    isAutoInfinite,
    maxBet,
    minBet,
    mode,
  ]);

  const actionLabel =
    mode === "auto"
      ? isAutoStopRequested
        ? "Stopping..."
        : isAutoRunning
          ? "Stop Auto-Bet"
          : "Start Auto-Bet"
      : "Bet";

  return {
    actionLabel,
    autoBetCount,
    betAmount,
    handleAutoBetCountChange,
    handleBetAmountBlur,
    handleBetAmountChange,
    handleBetAmountControlClick,
    handleModeChange,
    mode,
    profitOnWin: getDiceProfitOnWin(betAmount, multiplier),
    ...validation,
  };
}
