"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { memo } from "react";
import type { RefObject } from "react";
import pencilIcon from "@/assets/profile/pencil.svg";

type WalletFieldProps = {
  label: string;
  icon: StaticImageData;
  defaultValue: string;
  error: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isBusy: boolean;
  isEditing: boolean;
  isPending: boolean;
  isUnchanged: boolean;
  onChange: (next: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export const WalletField = memo(function WalletField({
  label,
  icon,
  defaultValue,
  error,
  inputRef,
  isBusy,
  isEditing,
  isPending,
  isUnchanged,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: WalletFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-(--color-surface) px-3 py-2.5 ${
          error ? "border-(--color-accent-red)" : "border-(--color-border-strong)"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 pr-1">
          <Image alt={`${label} logo`} className="size-6" src={icon} />
          <span className="text-[14px] text-(--color-text-muted)">{label}</span>
        </div>
        <span
          aria-hidden="true"
          className="-my-2.5 w-px self-stretch bg-(--color-border-strong)"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-(--color-text-primary) placeholder:text-(--color-text-subtle) focus:outline-none disabled:cursor-not-allowed"
          defaultValue={defaultValue}
          disabled={!isEditing || isPending}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !isUnchanged) {
              onSave();
            }
            if (event.key === "Escape") {
              onCancel();
            }
          }}
          placeholder="Enter address"
          ref={inputRef}
          type="text"
        />

        {isEditing ? (
          <div className="flex h-7 shrink-0 items-center gap-3 text-sm font-semibold">
            <button
              className="text-(--color-roulette-history-green) transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isPending || isUnchanged}
              onClick={onSave}
              type="button"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              className="text-(--color-text-subtle) transition hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isPending}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            aria-label={`Edit ${label} address`}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-(--color-text-subtle) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isBusy}
            onClick={onEdit}
            type="button"
          >
            <Image alt="Edit address" className="size-4" src={pencilIcon} />
          </button>
        )}
      </div>

      {error ? (
        <p className="px-1 text-xs text-(--color-accent-red)">{error}</p>
      ) : null}
    </div>
  );
});
