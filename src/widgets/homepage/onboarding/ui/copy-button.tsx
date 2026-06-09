"use client";

import Image from "next/image";

import CopyIcon from "@/assets/homePage/onboarding/copy.svg";
import { useCopyToClipboard } from "@/shared";

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="ml-1 inline-flex size-4  items-center justify-center  cursor-pointer"
      onClick={() => copy(value)}
      title={copied ? "Copied" : "Copy"}
      type="button"
    >
      <Image
        alt="Copy promo code"
        className="size-3.5"
        src={CopyIcon}
      />
    </button>
  );
}
