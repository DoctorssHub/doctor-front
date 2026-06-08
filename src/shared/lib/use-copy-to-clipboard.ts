"use client";

import { useEffect, useState } from "react";

type UseCopyToClipboardOptions = {
  resetDelay?: number;
};

export function useCopyToClipboard({
  resetDelay = 1200,
}: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), resetDelay);

    return () => window.clearTimeout(timeout);
  }, [copied, resetDelay]);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
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
    }

    setCopied(true);
  }

  return {
    copied,
    copy,
  };
}
