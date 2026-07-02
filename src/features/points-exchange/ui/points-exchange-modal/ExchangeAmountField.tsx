import Image from "next/image";
import type { StaticImageData } from "next/image";
import { parseInputAmount } from "../../lib/points-exchange-format";
import { BalanceBadge } from "./BalanceBadge";

type ExchangeAmountFieldProps = {
  balance: number;
  icon: StaticImageData;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

export function ExchangeAmountField({
  balance,
  icon,
  label,
  onChange,
  value,
}: ExchangeAmountFieldProps) {
  return (
    <label className="block text-left">
      <span className="text-[14px] leading-[125%] font-medium text-[#C9CEDA]">
        {label}
      </span>
      <span className="mt-2 flex h-[52px] items-center gap-2 rounded-[6px] border border-[#252B36] bg-[#20232E] px-3">
        <Image
          alt=""
          aria-hidden="true"
          className="size-5"
          height={20}
          src={icon}
          width={20}
        />
        <input
          aria-label={label}
          aria-invalid={parseInputAmount(value) > balance}
          className="min-w-0 flex-1 bg-transparent text-[16px] leading-[125%] font-bold text-[#FDFDFD] outline-none placeholder:text-[#697386]"
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          type="text"
          value={value}
        />
        <BalanceBadge balance={balance} icon={icon} />
      </span>
    </label>
  );
}
