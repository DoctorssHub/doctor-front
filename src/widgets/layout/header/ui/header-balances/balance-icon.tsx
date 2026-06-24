import Image from "next/image";
import redCoinIcon from "@/assets/shared/red-coin.svg";
import yellowCoinIcon from "@/assets/shared/yellow-coin.svg";
import { getBalanceIconType } from "./balance-utils";

export function BalanceIcon({ balanceType }: { balanceType: string }) {
  const icon = getBalanceIconType(balanceType);

  return (
    <Image
      src={icon === "yellow-coin" ? yellowCoinIcon : redCoinIcon}
      alt=""
      width={20}
      height={20}
      className="size-5 shrink-0 object-contain"
      aria-hidden="true"
    />
  );
}
