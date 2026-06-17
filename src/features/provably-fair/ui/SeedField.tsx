"use client";

import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

type SeedFieldProps = {
  label: string;
  value: string | number;
};

export function SeedField({ label, value }: SeedFieldProps) {
  const { copied, copy } = useCopyToClipboard();
  const textValue = String(value);

  return (
    <label className="block text-sm font-medium text-[var(--color-text-muted)]">
      {label}
      <span className="mt-2 flex min-h-11 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3">
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium text-[var(--color-text-primary)]">
          {textValue}
        </span>
        <button
          aria-label={copied ? "Copied" : `Copy ${label}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[var(--color-text-subtle)] transition hover:bg-[var(--color-surface-hover)] hover:text-white"
          onClick={() => copy(textValue)}
          type="button"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {copied ? "✓" : "□"}
          </span>
        </button>
      </span>
    </label>
  );
}
