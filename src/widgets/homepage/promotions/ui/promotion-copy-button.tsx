"use client";

import Image from "next/image";

import copyIcon from "@/assets/homePage/promotions/copy-purple.svg";
import { useCopyToClipboard } from "@/shared";

type PromotionCopyButtonProps = {
  value: string;
};

export function PromotionCopyButton({ value }: PromotionCopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="inline-flex size-4 cursor-pointer items-center justify-center"
      onClick={() => copy(value)}
      title={copied ? "Copied" : "Copy"}
      type="button"
    >
      <Image
        alt="Copy promo code"
        className="h-auto w-3"
        src={copyIcon}
      />
    </button>
  );
}
