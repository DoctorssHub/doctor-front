"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { getCurrentUser, logoutUser } from "@/features/auth/api/auth-api";
import { readUsername } from "@/features/auth/lib/read-auth-response";
import { Button } from "@/shared/ui/button";

export function HeaderAuthButton() {
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const username = useAuthSessionStore((state) => state.username);
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

    getCurrentUser()
      .then((response) => {
        const nextUsername = readUsername(response.data);

        if (isMounted && nextUsername) {
          setSession(nextUsername);
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
      <div className="flex items-center gap-3 max-tablet:gap-2">
        <span className="max-w-32 truncate text-sm font-bold text-(--color-text-primary) max-tablet:max-w-20 max-tablet:text-xs">
          {displayUsername}
        </span>
        <Button
          className="h-10 w-full cursor-pointer text-[16px] font-medium text-(--color-brand-contrast) disabled:cursor-not-allowed disabled:opacity-60 max-tablet:h-9 max-tablet:px-4 max-tablet:text-[14px] max-tablet:leading-none"
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
