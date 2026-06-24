import { memo } from "react";
import Image from "next/image";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type BetAmountFieldProps = {
  betAmount: string;
  isDisabled?: boolean;
  gameBalance: number;
  maxBet?: string;
  minBet?: string;
  showBalance?: boolean;
  onBetAmountBlur: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
};

function sanitizeAmountInput(value: string) {
  const normalizedValue = value.replace(",", ".");
  const [integerPart = "", ...fractionParts] = normalizedValue
    .replace(/[^\d.]/g, "")
    .split(".");
  const fractionPart = fractionParts.join("");

  return fractionParts.length > 0
    ? `${integerPart}.${fractionPart}`
    : integerPart;
}

const amountControls: Array<[BetAmountControl, string]> = [
  ["half", "1/2"],
  ["double", "2x"],
  ["max", "MAX"],
];

export const BetAmountField = memo(function BetAmountField({
  betAmount,
  isDisabled = false,
  gameBalance,
  maxBet,
  minBet,
  showBalance = true,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
}: BetAmountFieldProps) {
  return (
    <div className="mt-8 max-[1023px]:order-3 max-[1023px]:mt-5 max-[767px]:mt-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          className="flex w-full items-center justify-between text-sm font-semibold text-white"
          htmlFor="bet"
        >
          Bet Amount
          {showBalance ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Image
                src={redCoinIcon}
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
          ) : null}
        </label>
      </div>
      <div
        className={`flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3 transition ${
          isDisabled ? "opacity-60" : ""
        }`}
      >
        <Image
          src={redCoinIcon}
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
          onChange={(event) =>
            onBetAmountChange(sanitizeAmountInput(event.target.value))
          }
          pattern="[0-9]*[.]?[0-9]*"
          placeholder={minBet ? `Min ${minBet}` : undefined}
          type="text"
          value={betAmount}
        />
        <div className="ml-2 flex gap-1">
          {amountControls.map(([control, label]) => (
            <button
              className={[
                "h-7 rounded-[6px] border-[0.8px] border-[rgba(63,74,89,0.5)] bg-[#1B1F26] p-1.5 text-[10px] font-semibold text-white/45 transition hover:text-white disabled:cursor-not-allowed disabled:hover:text-white/45",
                control === "max" ? "w-[39px]" : "w-7",
              ].join(" ")}
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
});
