import Image from "next/image";
import infinityIcon from "@/assets/games/roulette/Infinity.svg";
import { AutoBetControls } from "@/widgets/game-sidebar/ui/AutoBetControls";
import { BetAmountField } from "@/widgets/game-sidebar/ui/BetAmountField";
import { GameBetButton } from "@/widgets/game-sidebar/ui/GameBetButton";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { ModeTabs } from "@/widgets/game-sidebar/ui/ModeTabs";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import type { DiceAutoConfig, DiceMode } from "../../model/use-dice-game";
import { DiceAutoConfigModal } from "./DiceAutoConfigModal";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type DiceBetControlsProps = {
  autoBetCount: string;
  autoConfig: DiceAutoConfig;
  betAmount: string;
  gameBalance: number;
  helperMessage: string | null;
  isAutoConfigOpen: boolean;
  isAutoInfinite: boolean;
  isAutoRunning: boolean;
  isAutoStopRequested: boolean;
  isBetDisabled: boolean;
  isLoading: boolean;
  maxBet: string;
  minBet: string;
  mode: DiceMode;
  profitOnWin: string;
  onAutoBetCountChange: (amount: string) => void;
  onAutoConfigApply: () => void;
  onAutoConfigChange: (config: DiceAutoConfig) => void;
  onAutoConfigClose: () => void;
  onAutoConfigOpen: () => void;
  onAutoConfigResetAll: () => void;
  onBetAmountBlur: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
  onModeChange: (mode: DiceMode) => void;
  onSubmit: () => void;
  onToggleAutoInfinite: () => void;
};

export function DiceBetControls({
  autoBetCount,
  autoConfig,
  betAmount,
  gameBalance,
  helperMessage,
  isAutoConfigOpen,
  isAutoInfinite,
  isAutoRunning,
  isAutoStopRequested,
  isBetDisabled,
  isLoading,
  maxBet,
  minBet,
  mode,
  profitOnWin,
  onAutoBetCountChange,
  onAutoConfigApply,
  onAutoConfigChange,
  onAutoConfigClose,
  onAutoConfigOpen,
  onAutoConfigResetAll,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
  onModeChange,
  onSubmit,
  onToggleAutoInfinite,
}: DiceBetControlsProps) {
  const actionLabel =
    mode === "auto"
      ? isAutoStopRequested
        ? "Stopping..."
        : isAutoRunning
          ? "Stop Auto-Bet"
          : "Start Auto-Bet"
      : "Bet";

  return (
    <GameSidebar>
      <ModeTabs
        activeButtonClassName="bg-[var(--color-surface-elevated)] text-white shadow-[var(--shadow-inset-soft)]"
        buttonClassName="h-10 rounded-lg transition duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold"
        inactiveButtonClassName="text-[var(--color-text-muted)] opacity-70 hover:text-white"
        isDisabled={isLoading}
        mode={mode}
        options={[
          { label: "Manual", value: "manual" },
          { label: "Auto", value: "auto" },
        ]}
        onModeChange={onModeChange}
      />

      <BetAmountField
        betAmount={betAmount}
        gameBalance={gameBalance}
        isDisabled={isLoading}
        maxBet={maxBet}
        minBet={minBet}
        onBetAmountBlur={onBetAmountBlur}
        onBetAmountChange={onBetAmountChange}
        onBetAmountControlClick={onBetAmountControlClick}
      />

      {mode === "auto" ? (
        <div className="dice-mode-panel" key="dice-auto-panel">
          <AutoBetControls
            autoBetsAmount={autoBetCount}
            buttonClassName="grid h-7 w-7 place-items-center rounded-[4px] hover:border-[var(--color-roulette-soft-border)] disabled:opacity-55"
            className="mt-5 block text-sm font-semibold text-white"
            fieldClassName="mt-2 h-11 gap-2 rounded-lg border-[var(--color-border-strong)] bg-[#0e121c] p-3"
            id="dice-auto-bet-count"
            infinityIconSrc={infinityIcon}
            inputMode="numeric"
            inputPattern="[0-9]*"
            inputType="text"
            isAutoBetsInfinite={isAutoInfinite}
            isDisabled={isLoading}
            isInputDisabled={isLoading}
            label="Number of bets"
            labelClassName="text-sm font-semibold text-white"
            onAutoBetsAmountChange={onAutoBetCountChange}
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
        disabled={isBetDisabled}
        isLoading={isLoading}
        label={actionLabel}
        onClick={onSubmit}
      />

      {helperMessage ? (
        <p className="mt-3 min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {helperMessage}
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
