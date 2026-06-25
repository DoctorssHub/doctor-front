import type { StaticImageData } from "next/image";
import btcIcon from "@/assets/profile/btc.svg";
import ethIcon from "@/assets/profile/eth.svg";
import ltcIcon from "@/assets/profile/ltc.svg";

export type WalletKey = "btc" | "eth" | "ltc";

export type WalletValues = Record<WalletKey, string>;

export type WalletConfig = {
  key: WalletKey;
  label: string;
  icon: StaticImageData;
};

export const WALLETS: WalletConfig[] = [
  { key: "btc", label: "BTC", icon: btcIcon },
  { key: "eth", label: "ETH", icon: ethIcon },
  { key: "ltc", label: "LTC", icon: ltcIcon },
];
