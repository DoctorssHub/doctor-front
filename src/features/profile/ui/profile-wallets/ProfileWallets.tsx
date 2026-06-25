"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useState } from "react";
import btcIcon from "@/assets/profile/btc.svg";
import ethIcon from "@/assets/profile/eth.svg";
import ltcIcon from "@/assets/profile/ltc.svg";
import pencilIcon from "@/assets/profile/pencil.svg";
import type { MeResponse } from "@/features/auth/api/auth-types";

type WalletKey = "btc" | "eth" | "ltc";

type WalletConfig = {
  key: WalletKey;
  label: string;
  icon: StaticImageData;
};

const WALLETS: WalletConfig[] = [
  { key: "btc", label: "BTC", icon: btcIcon },
  { key: "eth", label: "ETH", icon: ethIcon },
  { key: "ltc", label: "LTC", icon: ltcIcon },
];

type ProfileWalletsProps = {
  addresses: MeResponse["userCryptoAddresses"];
};

// UI-only for now: edits live in local state. Persisting addresses is wired
// once the backend update endpoint is confirmed.
export function ProfileWallets({ addresses }: ProfileWalletsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 max-laptop:grid-cols-1">
      {WALLETS.map((wallet) => (
        <WalletField
          icon={wallet.icon}
          initialValue={readAddress(addresses, wallet.key)}
          key={wallet.key}
          label={wallet.label}
        />
      ))}
    </div>
  );
}

function WalletField({
  label,
  icon,
  initialValue,
}: {
  label: string;
  icon: StaticImageData;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [seededValue, setSeededValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Re-seed from async profile data without an effect (render-phase sync).
  if (seededValue !== initialValue) {
    setSeededValue(initialValue);
    setValue(initialValue);
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-(--color-border-strong) bg-(--color-surface) px-3 py-2.5">
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
        disabled={!isEditing}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter address"
        type="text"
        value={value}
      />
      <button
        aria-label={
          isEditing ? `Save ${label} address` : `Edit ${label} address`
        }
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-(--color-text-subtle) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
        onClick={() => setIsEditing((editing) => !editing)}
        type="button"
      >
        <Image alt="Edit address" className="size-4" src={pencilIcon} />
      </button>
    </div>
  );
}

function readAddress(
  addresses: MeResponse["userCryptoAddresses"],
  key: WalletKey,
): string {
  if (!addresses) {
    return "";
  }

  const value = addresses[`${key}Address` as keyof typeof addresses];

  return typeof value === "string" ? value : "";
}
