"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { getCurrentUser, logoutUser } from "@/features/auth/api/auth-api";
import { readUsername } from "@/features/auth/lib/read-auth-response";

export function HomeScreen() {
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-auth-backdrop) px-6 text-(--color-text-primary)">
      {isAuthenticated && displayUsername ? (
        <div className="rounded-lg border border-(--color-border-control) bg-(--color-surface-card) px-6 py-4 text-center shadow-(--shadow-auth-card)">
          <p className="text-sm text-(--color-text-muted)">Logged in as</p>
          <p className="mt-1 text-xl font-bold">{displayUsername}</p>
          <button
            className="mt-4 h-10 rounded-lg bg-(--color-auth-control) px-5 text-sm font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover) disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : (
        <button
          className="h-12 rounded-lg bg-(--color-auth-action) px-8 text-sm font-bold text-(--color-auth-action-contrast) transition hover:bg-(--color-auth-action-hover)"
          type="button"
          onClick={() => openAuthModal("login")}
        >
          Login
        </button>
      )}
    </main>
  );
}
