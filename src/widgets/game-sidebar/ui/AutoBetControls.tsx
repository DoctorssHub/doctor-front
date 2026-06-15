import { memo } from "react";
import Image from "next/image";

type AutoBetControlsProps = {
  autoBetsAmount: string;
  isAutoBetsInfinite: boolean;
  isDisabled?: boolean;
  onAutoBetsAmountChange: (amount: string) => void;
  onAutoBetsInfinityToggle: () => void;
};

export const AutoBetControls = memo(function AutoBetControls({
  autoBetsAmount,
  isAutoBetsInfinite,
  isDisabled = false,
  onAutoBetsAmountChange,
  onAutoBetsInfinityToggle,
}: AutoBetControlsProps) {
  return (
    <label
      className="mt-6 block text-sm font-semibold text-white max-[1023px]:order-6 max-[1023px]:mt-5"
      htmlFor="auto-bets"
    >
      Number of Bets
      <span className="mt-2 flex items-center gap-2">
        <span
          className={`flex h-7 min-w-0 flex-1 items-center rounded-md border border-[#202938] bg-[#1B1F2640] px-3 transition ${
            isDisabled ? "opacity-60" : ""
          }`}
        >
          {isAutoBetsInfinite ? (
            <span className="flex flex-1 items-center justify-start">
              <Image
                src="/infinity-icon.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
                aria-hidden="true"
              />
            </span>
          ) : (
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed"
              disabled={isDisabled}
              id="auto-bets"
              inputMode="numeric"
              min={1}
              onChange={(event) => onAutoBetsAmountChange(event.target.value)}
              type="number"
              value={autoBetsAmount}
            />
          )}
          <button
            aria-pressed={isAutoBetsInfinite}
            aria-label="Toggle infinite autobet"
            className={`ml-2 flex size-5 shrink-0 items-center justify-center rounded border border-[#3F4A5980] transition hover:bg-[#1b2230] disabled:cursor-not-allowed ${
              isAutoBetsInfinite ? "bg-[#1b2230]" : "bg-transparent"
            }`}
            disabled={isDisabled}
            onClick={onAutoBetsInfinityToggle}
            type="button"
          >
            <Image
              src="/infinity-icon.svg"
              alt=""
              width={14}
              height={14}
              className="size-3.5"
              aria-hidden="true"
            />
          </button>
        </span>
      </span>
    </label>
  );
});
