"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
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
  const currentSeed = serializeWalletValues(initialValues);
  const [seed, setSeed] = useState(currentSeed);
  const [isEditing, setIsEditing] = useState(false);
  const [isUnchanged, setIsUnchanged] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draftValueRef = useRef(initialValue);
  const mutation = useUpdateCryptoAddresses();

  useEffect(() => {
    if (isEditing || seed === currentSeed) {
      return;
    }

    setSeed(currentSeed);
    draftValueRef.current = initialValue;
    setIsUnchanged(true);

    if (inputRef.current) {
      inputRef.current.value = initialValue;
    }
  }, [currentSeed, initialValue, isEditing, seed]);

  const startEditing = useCallback(() => {
    mutation.reset();
    setErrorMessage(null);
    draftValueRef.current = inputRef.current?.value ?? initialValue;
    setIsUnchanged(draftValueRef.current === initialValue);
    setIsEditing(true);
  }, [initialValue, mutation]);

  const cancelEditing = useCallback(() => {
    mutation.reset();
    setErrorMessage(null);
    draftValueRef.current = initialValue;
    setIsUnchanged(true);
    if (inputRef.current) {
      inputRef.current.value = initialValue;
    }
    setIsEditing(false);
  }, [initialValue, mutation]);

  const save = useCallback(() => {
    const nextValue = draftValueRef.current;

    if (nextValue === initialValue) {
      return;
    }

    setErrorMessage(null);

    mutation.mutate(buildPayload(initialValues, wallet.key, nextValue), {
      onSuccess: () => {
        setIsUnchanged(true);
        setIsEditing(false);
      },
      onError: (error) => {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Couldn't update wallet address. Please try again.",
          ),
        );
      },
    });
  }, [initialValue, initialValues, mutation, wallet.key]);

  const handleChange = useCallback((nextValue: string) => {
    const nextIsUnchanged = nextValue === initialValue;

    draftValueRef.current = nextValue;
    setErrorMessage(null);
    setIsUnchanged((currentIsUnchanged) =>
      currentIsUnchanged === nextIsUnchanged
        ? currentIsUnchanged
        : nextIsUnchanged,
    );
  }, [initialValue]);

  return (
    <WalletField
      defaultValue={initialValue}
      error={errorMessage}
      icon={wallet.icon}
      inputRef={inputRef}
      isBusy={mutation.isPending}
      isEditing={isEditing}
      isPending={mutation.isPending}
      isUnchanged={isUnchanged}
      label={wallet.label}
      onCancel={cancelEditing}
      onChange={handleChange}
      onEdit={startEditing}
      onSave={save}
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
