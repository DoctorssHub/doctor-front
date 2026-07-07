import Image from "next/image";
import exchangeIcon from "@/assets/games/dice/relloverIcon.svg";
import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import { BalanceRow } from "./balance-row";

export function BalanceDropdown({
  balances,
  onExchangeClick,
}: {
  balances: UserBalance[];
  onExchangeClick: () => void;
}) {
  return (
    <div className="absolute top-full left-1/2 z-50 mt-3 w-[303px] -translate-x-1/2 max-tablet:fixed max-tablet:top-16 max-tablet:right-4 max-tablet:left-auto max-tablet:translate-x-0 max-mobile:right-3 max-mobile:w-[min(303px,calc(100vw-24px))]">
      <div className="origin-top rounded-b-[14px] bg-[#0a0d19] px-4 pt-4 pb-3 shadow-[0_16px_32px_rgb(0_0_0/35%)] ring-1 ring-[#121826] [animation:dice-mode-panel-in_180ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <h2 className="mb-3 text-[14px] leading-[125%] font-bold text-[#fdfdfd]">
          Points Balances
        </h2>
        <div className="flex flex-col gap-2">
          {balances.map((balance) => (
            <BalanceRow
              balance={balance}
              key={balance.balanceType}
            />
          ))}
        </div>
        <button
          className="relative mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[6px] border border-transparent bg-[#252b36] text-[16px] leading-[125%] font-bold text-[#fdfdfd] transition-[border-color,box-shadow,background-color,transform] before:absolute before:inset-0 before:bg-[var(--color-brand)] before:opacity-0 before:blur-xl before:transition before:content-[''] hover:border-[var(--color-brand)] hover:bg-[#252b36] hover:shadow-[0_0_18px_rgb(200_40_49/45%)] hover:before:opacity-45 active:scale-[0.99] focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:shadow-[0_0_18px_rgb(200_40_49/45%)]"
          onClick={onExchangeClick}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="relative size-5 shrink-0 object-contain"
            height={20}
            src={exchangeIcon}
            width={20}
          />
          <span className="relative">Exchange Points</span>
        </button>
      </div>
    </div>
  );
}
