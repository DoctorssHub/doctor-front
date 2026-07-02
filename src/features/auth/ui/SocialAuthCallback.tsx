"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "../api/auth-api";
import {
  readUserBalances,
  readUserProfileImage,
  readUsername,
} from "../lib/read-auth-response";
import { useAuthSessionStore } from "../model/auth-session-store";
import { consumeSocialAuthReturnPath } from "../model/social-auth";

type CallbackStatus = "loading" | "success" | "error";

export function SocialAuthCallback() {
  const router = useRouter();
  const setSession = useAuthSessionStore((state) => state.setSession);
  const clearSession = useAuthSessionStore((state) => state.clearSession);
  const [status, setStatus] = useState<CallbackStatus>(() =>
    hasProviderError() ? "error" : "loading",
  );

  useEffect(() => {
    let isMounted = true;
    const query = new URLSearchParams(window.location.search);
    const providerError = query.get("error");

    if (providerError) {
      clearSession();
      return;
    }

    getCurrentSession()
      .then((response) => {
        const username = readUsername(response.data.user);
        const balances = readUserBalances(response.data.user);
        const profileImgUrl = readUserProfileImage(response.data.user);

        if (!response.data.authenticated || !username) {
          throw new Error("Social auth session was not returned.");
        }

        if (!isMounted) {
          return;
        }

        setSession(username, balances, profileImgUrl);
        setStatus("success");
        router.replace(consumeSocialAuthReturnPath());
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearSession();
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [clearSession, router, setSession]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-(--color-page) px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-(--color-auth-form-border) bg-(--color-page-raised) p-8 text-center shadow-(--shadow-auth-card)">
        <p className="text-sm font-semibold uppercase text-(--color-text-subtle)">
          Social auth
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-(--color-text-primary)">
          {status === "error" ? "Authentication failed" : "Signing you in"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
          {status === "error"
            ? "Please return to the login modal and try another provider."
            : "Please wait while we confirm your account."}
        </p>
      </section>
    </main>
  );
}

function hasProviderError() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).has("error");
}
