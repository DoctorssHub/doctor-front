"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import copyIcon from "@/assets/homePage/promotions/copy-purple.svg";

type PromotionCopyButtonProps = {
  value: string;
};

export function PromotionCopyButton({ value }: PromotionCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1200);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
      setCopied(true);
    }
  }

  return (
    <button
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="inline-flex size-4 cursor-pointer items-center justify-center"
      onClick={handleCopy}
      title={copied ? "Copied" : "Copy"}
      type="button"
    >
      <Image
        alt=""
        className="h-auto w-3"
        src={copyIcon}
      />
    </button>
  );
}
