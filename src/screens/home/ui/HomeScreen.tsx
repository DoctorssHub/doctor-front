"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { getCurrentUser, logoutUser } from "@/features/auth/api/auth-api";
import { logAuthError, logAuthSuccess } from "@/features/auth/lib/log-auth-response";
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
    onSuccess: (response) => {
      logAuthSuccess("logout", response);
      clearSession();
    },
    onError: (error) => {
      logAuthError("logout", error);
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
    <main className="flex min-h-screen items-center justify-center bg-[#050812] px-6 text-white">
      {isAuthenticated && displayUsername ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <p className="text-sm text-white/60">Logged in as</p>
          <p className="mt-1 text-xl font-bold">{displayUsername}</p>
          <button
            className="mt-4 h-10 rounded-lg bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : (
        <button
          className="h-12 rounded-lg bg-[#c82831] px-8 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43]"
          type="button"
          onClick={() => openAuthModal("login")}
        >
          Login
        </button>
      )}
    </main>
  );
}
