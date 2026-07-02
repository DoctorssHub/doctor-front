import Image from "next/image";
import { useCallback, useState } from "react";
import { AutoBetControls } from "@/shared/ui/game-sidebar/ui/AutoBetControls";
import {
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
} from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { BetAmountField } from "@/shared/ui/game-sidebar/ui/BetAmountField";
import { GameBetButton } from "@/shared/ui/game-sidebar/ui/GameBetButton";
import { GameSidebar } from "@/shared/ui/game-sidebar/ui/GameSidebar";
import { ModeTabs } from "@/shared/ui/game-sidebar/ui/ModeTabs";
import type { BetAmountControl } from "@/shared/ui/game-sidebar/lib/bet-amount-controls";
import { sanitizeIntegerInput } from "@/shared/ui/game-sidebar/lib/numeric-input";
import { formatDiceNumber, getDiceProfitOnWin } from "../../lib/dice-calculations";
import type { DiceAutoConfig, DiceMode } from "../../model/dice-game-options";
import { DiceAutoConfigModal } from "./DiceAutoConfigModal";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type DiceBetControlsProps = {
  autoConfig: DiceAutoConfig;
  gameBalance: number;
  helperMessage: string | null;
  isAutoConfigOpen: boolean;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isAutoStopRequested: boolean;
  isBetDisabled: boolean;
  isFullscreen?: boolean;
  isLoading: boolean;
  maxBet: string;
  minBet: string;
  multiplier: number;
  onAutoBetCountChange: (amount: string) => void;
  onAutoConfigApply: () => void;
  onAutoConfigChange: (config: DiceAutoConfig) => void;
  onAutoConfigClose: () => void;
  onAutoConfigOpen: () => void;
  onAutoConfigResetAll: () => void;
  onBetAmountChange: (amount: string) => void;
  onModeChange: (mode: DiceMode) => void;
  onSubmit: () => void;
  onToggleAutoInfinite: () => void;
};

export function DiceBetControls({
  autoConfig,
  gameBalance,
  helperMessage,
  isAutoConfigOpen,
  isAutoInfinite,
  isAutoRunning,
  isAutoStopRequested,
  isBetDisabled,
  isFullscreen = false,
  isLoading,
  maxBet,
  minBet,
  multiplier,
  onAutoBetCountChange,
  onAutoConfigApply,
  onAutoConfigChange,
  onAutoConfigClose,
  onAutoConfigOpen,
  onAutoConfigResetAll,
  onBetAmountChange,
  onModeChange,
  onSubmit,
  onToggleAutoInfinite,
}: DiceBetControlsProps) {

  const [autoBetCount, setAutoBetCount] = useState("10");
  const [betAmount, setBetAmount] = useState("10.00");
  const [mode, setMode] = useState<DiceMode>("manual");
  const handleModeChange = useCallback((nextMode: DiceMode) => {
    setMode(nextMode);
    onModeChange(nextMode);
  }, [onModeChange]);
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
  const profitOnWin = getDiceProfitOnWin(betAmount, multiplier);
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

  const actionLabel =
    mode === "auto"
      ? isAutoStopRequested
        ? "Stopping..."
        : isAutoRunning
          ? "Stop Auto-Bet"
          : "Start Auto-Bet"
      : "Bet";

  return (
    <GameSidebar
      className={isFullscreen ? "min-[1024px]:h-full" : undefined}
    >
      <ModeTabs
        className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold"
        isDisabled={isLoading}
        mode={mode}
        options={[
          { label: "Manual", value: "manual" },
          { label: "Auto", value: "auto" },
        ]}
        onModeChange={handleModeChange}
      />

      <BetAmountField
        betAmount={betAmount}
        gameBalance={gameBalance}
        isDisabled={isLoading}
        maxBet={maxBet}
        minBet={minBet}
        onBetAmountBlur={handleBetAmountBlur}
        onBetAmountChange={handleBetAmountChange}
        onBetAmountControlClick={handleBetAmountControlClick}
      />

      {mode === "auto" ? (
        <div className="dice-mode-panel" key="dice-auto-panel">
          <AutoBetControls
            autoBetsAmount={autoBetCount}
            className="mt-5 block text-sm font-medium text-[var(--color-text-primary)]"
            id="dice-auto-bet-count"
            inputMode="numeric"
            isAutoBetsInfinite={isAutoInfinite}
            isDisabled={isLoading}
            isInputDisabled={isLoading}
            onAutoBetsAmountChange={handleAutoBetCountChange}
            onAutoBetsInfinityToggle={onToggleAutoInfinite}
          />

          <div className="mt-6 grid grid-cols-2 gap-1">
            <AutoSummaryCard
              label="On Win"
              value={formatAutoModeValue(
                autoConfig.onWinMode,
                autoConfig.onWinIncrease,
              )}
            />
            <AutoSummaryCard
              label="On Loss"
              value={formatAutoModeValue(
                autoConfig.onLossMode,
                autoConfig.onLossIncrease,
              )}
            />
            <AutoSummaryCard
              coin
              label="Stop on Profit"
              value={autoConfig.stopOnProfit}
            />
            <AutoSummaryCard
              coin
              label="Stop on Loss"
              value={autoConfig.stopOnLoss}
            />
          </div>

          <button
            className="mt-6 h-12 w-full rounded-lg bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            disabled={isLoading}
            onClick={onAutoConfigOpen}
            type="button"
          >
            Configure
          </button>

          {isAutoConfigOpen ? (
            <DiceAutoConfigModal
              config={autoConfig}
              onApply={onAutoConfigApply}
              onChange={onAutoConfigChange}
              onClose={onAutoConfigClose}
              onResetAll={onAutoConfigResetAll}
            />
          ) : null}
        </div>
      ) : (
        <div className="dice-mode-panel mt-5" key="dice-manual-panel">
          <label
            className="mb-2 block text-sm font-semibold text-white"
            htmlFor="dice-profit-on-win"
          >
            Profit on Win
          </label>
          <div className="flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3">
            <Image
              src={redCoinIcon}
              alt=""
              width={16}
              height={16}
              className="mr-2"
              aria-hidden="true"
            />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white/55 outline-none"
              id="dice-profit-on-win"
              readOnly
              type="text"
              value={profitOnWin}
            />
          </div>
        </div>
      )}

      <GameBetButton
        className={mode === "auto" ? "mt-2" : "mt-6"}
        disabled={isBetDisabled || isBetAmountInvalid || isAutoBetCountInvalid}
        isLoading={isLoading}
        label={actionLabel}
        onClick={onSubmit}
      />

      {submitHelperMessage ? (
        <p className="mt-3 min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {submitHelperMessage}
        </p>
      ) : (
        <p className="mt-3 min-h-5" />
      )}
    </GameSidebar>
  );
}

function formatAutoModeValue(
  mode: DiceAutoConfig["onWinMode"],
  increaseValue: string,
) {
  return mode === "reset" ? "Auto" : `${increaseValue}%`;
}

type AutoSummaryCardProps = {
  coin?: boolean;
  label: string;
  value: string;
};

function AutoSummaryCard({ coin = false, label, value }: AutoSummaryCardProps) {

  return (
    <div className="h-[60px] w-[150px] rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 backdrop-blur-[4.8px]">
      <p className="text-xs font-semibold text-[#6b7280]">{label}</p>
      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#fdfdfd]">
        {coin ? (
          <Image
            src={redCoinIcon}
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
        ) : null}
        {value}
      </div>
    </div>
  );
}
