import type { MeResponse } from "@/features/auth/api/auth-types";
import type { WalletKey, WalletValues } from "../model/wallet-config";

export function readWalletValues(
  addresses: MeResponse["userCryptoAddresses"],
): WalletValues {
  return {
    btc: readAddress(addresses, "btc"),
    eth: readAddress(addresses, "eth"),
    ltc: readAddress(addresses, "ltc"),
  };
}

export function serializeWalletValues(values: WalletValues): string {
  return `${values.btc}|${values.eth}|${values.ltc}`;
}

export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
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
