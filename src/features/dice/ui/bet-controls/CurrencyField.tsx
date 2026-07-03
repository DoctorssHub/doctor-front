import Image from "next/image";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type CurrencyFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function CurrencyField({
  id,
  label,
  value,
  onChange,
}: CurrencyFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-bold text-white">{label}</span>
      <span className="flex h-11 w-[470px] items-center rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 text-xs font-semibold leading-[1.33] text-[#c7cbd4] max-[620px]:w-full">
        <Image
          src={redCoinIcon}
          alt=""
          width={16}
          height={16}
          className="mr-2"
          aria-hidden="true"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-xs font-semibold leading-[1.33] text-[#c7cbd4] outline-none"
          id={id}
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value)}
          pattern="[0-9]*[.]?[0-9]*"
          type="text"
          value={value}
        />
        <span className="ml-2 text-xs font-semibold leading-[1.33] text-[#c7cbd4]">
          $0.00
        </span>
      </span>
    </label>
  );
}
