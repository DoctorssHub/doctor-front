import Image from "next/image";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";

type BetAmountFieldProps = {
  balanceLabel?: string;
  betAmount: string;
  isDisabled?: boolean;
  maxBet?: string;
  minBet?: string;
  onBetAmountBlur: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
};

const amountControls: Array<[BetAmountControl, string]> = [
  ["half", "1/2"],
  ["double", "2x"],
  ["max", "MAX"],
];

export function BetAmountField({
  balanceLabel,
  betAmount,
  isDisabled = false,
  maxBet,
  minBet,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
}: BetAmountFieldProps) {
  return (
    <div className="mt-8 max-[1023px]:order-3 max-[1023px]:mt-5 max-[767px]:mt-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-white" htmlFor="bet">
          Bet Amount
        </label>
        {balanceLabel ? (
          <span className="hidden items-center gap-1 text-xs font-semibold text-white/75 max-[1023px]:flex">
            <Image
              src="/red-coin.svg"
              alt=""
              width={14}
              height={14}
              className="size-3.5"
              aria-hidden="true"
            />
            {balanceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3 transition has-[:disabled]:opacity-60">
        <Image
          src="/red-coin.svg"
          alt=""
          width={16}
          height={16}
          className="mr-2"
          aria-hidden="true"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed"
          disabled={isDisabled}
          id="bet"
          inputMode="decimal"
          max={maxBet}
          min={minBet}
          onBlur={onBetAmountBlur}
          onChange={(event) => onBetAmountChange(event.target.value)}
          placeholder={minBet ? `Min ${minBet}` : undefined}
          type="number"
          value={betAmount}
        />
        <div className="ml-2 flex gap-1">
          {amountControls.map(([control, label]) => (
            <button
              className="h-6 rounded bg-[#1B1F26] border border-[#3F4A5980] px-2 text-[10px] font-semibold text-white/45 transition hover:text-white disabled:cursor-not-allowed disabled:hover:text-white/45"
              disabled={isDisabled}
              key={control}
              onClick={() => onBetAmountControlClick(control)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
