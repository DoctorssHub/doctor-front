import Image from "next/image";
import { BetAmountField } from "@/widgets/game-sidebar/ui/BetAmountField";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { ModeTabs } from "@/widgets/game-sidebar/ui/ModeTabs";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import type { DiceMode } from "../../model/use-dice-game";

type DiceBetControlsProps = {
  betAmount: string;
  gameBalance: number;
  helperMessage: string | null;
  isBetDisabled: boolean;
  isLoading: boolean;
  maxBet: string;
  minBet: string;
  mode: DiceMode;
  profitOnWin: string;
  onBetAmountBlur: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
  onModeChange: (mode: DiceMode) => void;
  onSubmit: () => void;
};

export function DiceBetControls({
  betAmount,
  gameBalance,
  helperMessage,
  isBetDisabled,
  isLoading,
  maxBet,
  minBet,
  mode,
  profitOnWin,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
  onModeChange,
  onSubmit,
}: DiceBetControlsProps) {
  return (
    <GameSidebar>
      <ModeTabs
        activeButtonClassName="bg-[linear-gradient(180deg,rgb(27_31_38/65%)_0%,rgb(43_48_59/55%)_100%)] text-white shadow-[var(--shadow-inset-soft)]"
        buttonClassName="flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        className="grid grid-cols-2 gap-3 rounded-lg"
        inactiveButtonClassName="text-white/70 hover:bg-[#171d29]"
        mode={mode}
        options={[
          { label: "Manual", value: "manual" },
          { label: "Auto", value: "auto" },
        ]}
        onModeChange={onModeChange}
      />

      <div className="mt-8 flex items-center justify-end gap-2 text-sm font-semibold text-white max-[1023px]:mt-5">
        <Image
          src="/red-coin.svg"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
        />
        {gameBalance.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </div>

      <BetAmountField
        betAmount={betAmount}
        isDisabled={isLoading}
        maxBet={maxBet}
        minBet={minBet}
        onBetAmountBlur={onBetAmountBlur}
        onBetAmountChange={onBetAmountChange}
        onBetAmountControlClick={onBetAmountControlClick}
      />

      <div className="mt-5">
        <label
          className="mb-2 block text-sm font-semibold text-white"
          htmlFor="dice-profit-on-win"
        >
          Profit on Win
        </label>
        <div className="flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3">
          <Image
            src="/red-coin.svg"
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

      <button
        className="mt-6 h-12 w-full rounded-lg bg-[var(--color-brand)] text-sm font-bold text-[var(--color-brand-contrast)] transition hover:bg-[var(--color-brand-hover)] disabled:bg-[var(--color-surface-hover)] disabled:text-[var(--color-text-disabled)]"
        disabled={isBetDisabled}
        onClick={onSubmit}
        type="button"
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : null}
          Bet
        </span>
      </button>

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
