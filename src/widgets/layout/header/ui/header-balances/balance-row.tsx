import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import { BalanceIcon } from "./balance-icon";
import { getBalanceLabel, getBalanceTooltip } from "./balance-utils";

export function BalanceRow({ balance }: { balance: UserBalance }) {
  const label = getBalanceLabel(balance.balanceType);
  const tooltip = getBalanceTooltip(balance.balanceType);

  return (
    <div className="flex h-[34px] items-center justify-between gap-3 rounded-[6px] bg-[#1b1f26] px-3 py-2">
      <span className="flex min-w-0 items-center gap-1.5">
        <BalanceIcon balanceType={balance.balanceType} />
        <span className="truncate text-[14px] leading-[125%] font-medium text-[#c7cbd4]">
          {label}
        </span>
        <span
          className="group relative inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#8a94a7] text-[11px] leading-none font-bold text-[#1b1f26] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          tabIndex={0}
        >
          i
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-[238px] -translate-x-1/2 rounded-[6px] border border-[#1b2435] bg-[#080c17] px-3 py-2 text-left text-[13px] leading-[140%] font-bold text-[#fdfdfd] opacity-0 shadow-[0_12px_24px_rgb(0_0_0/35%)] transition group-hover:opacity-100 group-focus-within:opacity-100">
            {tooltip}
          </span>
        </span>
      </span>
      <span className="shrink-0 text-[16px] leading-[125%] font-bold text-[#fdfdfd]">
        {balance.value}
      </span>
    </div>
  );
}
