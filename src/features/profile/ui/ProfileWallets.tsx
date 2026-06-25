"use client";

import { memo, useState } from "react";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { getApiErrorMessage } from "../lib/profile-error";
import {
  emptyToNull,
  readWalletValues,
  serializeWalletValues,
} from "../lib/wallet-utils";
import { useUpdateCryptoAddresses } from "../model/use-update-crypto-addresses";
import {
  WALLETS,
  type WalletConfig,
  type WalletKey,
  type WalletValues,
} from "../model/wallet-config";
import { WalletField } from "./WalletField";

type ProfileWalletsProps = {
  addresses: MeResponse["userCryptoAddresses"];
};

export const ProfileWallets = memo(function ProfileWallets({
  addresses,
}: ProfileWalletsProps) {
  const initialValues = readWalletValues(addresses);

  return (
    <div className="grid grid-cols-3 gap-4 max-laptop:grid-cols-1">
      {WALLETS.map((wallet) => (
        <WalletEditor
          initialValue={initialValues[wallet.key]}
          initialValues={initialValues}
          key={wallet.key}
          wallet={wallet}
        />
      ))}
    </div>
  );
});

type WalletEditorProps = {
  initialValue: string;
  initialValues: WalletValues;
  wallet: WalletConfig;
};

const WalletEditor = memo(function WalletEditor({
  initialValue,
  initialValues,
  wallet,
}: WalletEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [seed, setSeed] = useState(serializeWalletValues(initialValues));
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mutation = useUpdateCryptoAddresses();

  const currentSeed = serializeWalletValues(initialValues);
  if (!isEditing && seed !== currentSeed) {
    setSeed(currentSeed);
    setValue(initialValue);
  }

  const startEditing = () => {
    mutation.reset();
    setErrorMessage(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    mutation.reset();
    setErrorMessage(null);
    setValue(initialValue);
    setIsEditing(false);
  };

  const save = () => {
    setErrorMessage(null);

    mutation.mutate(buildPayload(initialValues, wallet.key, value), {
      onSuccess: () => setIsEditing(false),
      onError: (error) => {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Couldn't update wallet address. Please try again.",
          ),
        );
      },
    });
  };

  return (
    <WalletField
      error={errorMessage}
      icon={wallet.icon}
      isBusy={mutation.isPending}
      isEditing={isEditing}
      isPending={mutation.isPending}
      isUnchanged={value === initialValue}
      label={wallet.label}
      onCancel={cancelEditing}
      onChange={(next) => {
        setErrorMessage(null);
        setValue(next);
      }}
      onEdit={startEditing}
      onSave={save}
      value={value}
    />
  );
});

function buildPayload(
  initialValues: WalletValues,
  key: WalletKey,
  value: string,
) {
  const nextValues = {
    ...initialValues,
    [key]: value,
  };

  return {
    btcAddress: emptyToNull(nextValues.btc),
    ethAddress: emptyToNull(nextValues.eth),
    ltcAddress: emptyToNull(nextValues.ltc),
  };
}
