"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { getCurrentSession, logoutUser } from "@/features/auth/api/auth-api";
import {
  readUserBalances,
  readUsername,
} from "@/features/auth/lib/read-auth-response";
import { Button } from "@/shared/ui/button";
import { HeaderBalances } from "./header-balances";
import { HeaderProfileMenu } from "./header-profile";

export function HeaderAuthButton() {
  const { openAuthModal } = useAuthModalStore(
    useShallow((state) => ({
      openAuthModal: state.openAuthModal,
    })),
  );
  const { balances, clearSession, isAuthenticated, setSession, username } =
    useAuthSessionStore(
      useShallow((state) => ({
        balances: state.balances,
        clearSession: state.clearSession,
        isAuthenticated: state.isAuthenticated,
        setSession: state.setSession,
        username: state.username,
      })),
  );
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
          <HeaderBalances balances={balances} />
          <HeaderProfileMenu
            isLogoutPending={logoutMutation.isPending}
            username={displayUsername}
            onLogout={() => logoutMutation.mutate()}
          />
        </div>
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
