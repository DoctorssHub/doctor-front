"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import redCoinIcon from "@/assets/shared/red-coin.svg";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { getCurrentSession, logoutUser } from "@/features/auth/api/auth-api";
import {
  readUserBalances,
  readUsername,
} from "@/features/auth/lib/read-auth-response";
import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import { Button } from "@/shared/ui/button";
export function HeaderAuthButton() {
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const username = useAuthSessionStore((state) => state.username);
  const balances = useAuthSessionStore((state) => state.balances);
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const setSession = useAuthSessionStore((state) => state.setSession);
  const clearSession = useAuthSessionStore((state) => state.clearSession);
  const displayUsername = username && !username.includes("@") ? username : null;
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearSession();
    },
    onError: () => {
      clearSession();
    },
  });

  useEffect(() => {
    let isMounted = true;

    getCurrentSession()
      .then((response) => {
        const nextUsername = readUsername(response.data.user);
        const nextBalances = readUserBalances(response.data.user);

        if (isMounted && response.data.authenticated && nextUsername) {
          setSession(nextUsername, nextBalances);
          return;
        }

        if (isMounted) {
          clearSession();
        }
      })
      .catch(() => {
        if (isMounted) {
          clearSession();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clearSession, setSession]);

  if (isAuthenticated && displayUsername) {
    return (
      <div className="flex min-w-0 items-center gap-3 max-tablet:gap-2">
        <div className="flex min-w-0 items-center gap-2 max-tablet:gap-1.5">
          {balances.map((balance, index) => (
            <HeaderBalance
              balance={balance}
              key={`${balance.balanceType}-${index}`}
            />
          ))}
          <div className="min-w-0 max-w-[min(34vw,22rem)] text-right max-tablet:max-w-[30vw]">
            <span className="block whitespace-normal break-words text-sm leading-4 font-bold text-(--color-text-primary) max-tablet:text-[11px] max-tablet:leading-3.5">
              {displayUsername}
            </span>
          </div>
        </div>
        <Button
          className="h-10 shrink-0 cursor-pointer text-[16px] font-medium text-(--color-brand-contrast) disabled:cursor-not-allowed disabled:opacity-60 max-tablet:h-9 max-tablet:px-3 max-tablet:text-[13px] max-tablet:leading-none"
          type="button"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast) max-tablet:h-9 max-tablet:px-4 max-tablet:text-[14px] max-tablet:leading-none"
      type="button"
      onClick={() => openAuthModal("login")}
    >
      Log In
    </Button>
  );
}

function HeaderBalance({
  balance,
}: {
  balance: UserBalance;
}) {
  const iconType = getBalanceIconType(balance.balanceType);

  return (
    <span className="flex shrink-0 items-center gap-1 rounded-md border border-(--color-border-button) bg-(--color-surface-elevated)/70 px-2 py-1 text-xs font-semibold text-(--color-text-primary) max-tablet:px-1.5 max-tablet:text-[10px]">
      {iconType === "coin" ? (
        <Image
          src={redCoinIcon}
          alt=""
          width={16}
          height={16}
          className="size-4 max-tablet:size-3.5"
          aria-hidden="true"
        />
      ) : (
        <span
          className="size-3.5 rounded-full bg-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.45)] max-tablet:size-3"
          aria-hidden="true"
        />
      )}
      <span>{balance.value}</span>
    </span>
  );
}

function getBalanceIconType(balanceType: string) {
  if (isGamePointsBalanceType(balanceType)) {
    return "coin";
  }

  if (isWatchPointsBalanceType(balanceType)) {
    return "dot";
  }

  return "dot";
}

function isGamePointsBalanceType(balanceType: string) {
  const normalizedBalanceType = normalizeBalanceType(balanceType);

  return normalizedBalanceType.includes("gamepoint");
}

function isWatchPointsBalanceType(balanceType: string) {
  const normalizedBalanceType = normalizeBalanceType(balanceType);

  return normalizedBalanceType.includes("watchpoint");
}

function normalizeBalanceType(balanceType: string) {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase();
}
