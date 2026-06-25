import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import { BalanceIcon } from "./balance-icon";

export function BalancePillItem({
  balance,
  isFirst,
}: {
  balance: UserBalance;
  isFirst: boolean;
}) {
  return (
    <>
      {!isFirst ? (
        <span
          aria-hidden="true"
          className="h-5 w-px shrink-0 bg-[#3f4a59]/50"
        />
      ) : null}
      <span className="flex shrink-0 items-center gap-2">
        <BalanceIcon balanceType={balance.balanceType} />
        <span>{balance.value}</span>
      </span>
    </>
  );
}
