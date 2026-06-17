"use client";

import Image from "next/image";
import copyIcon from "@/assets/games/provably-fair/copyIcon.svg";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

type SeedFieldProps = {
  label: string;
  value: string | number;
};

export function SeedField({ label, value }: SeedFieldProps) {
  const { copied, copy } = useCopyToClipboard();
  const textValue = String(value);

  return (
    <label className="block text-sm font-light text-[#c7cbd4]">
      {label}
      <span className="mt-2 flex h-11 items-center gap-3 rounded-[8px] border border-[#1b1f26] bg-[#0e121c] px-3 py-3">
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal text-[#c7cbd4]">
          {textValue}
        </span>
        <button
          aria-label={copied ? "Copied" : `Copy ${label}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md transition hover:bg-[var(--color-surface-hover)]"
          onClick={() => copy(textValue)}
          type="button"
        >
          <Image alt="" height={16} src={copyIcon} width={16} />
        </button>
      </span>
    </label>
  );
}
