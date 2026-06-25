"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "@/features/auth/model/auth-session-store";
import { updateUserInfo } from "../api/profile-api";
import { isUnauthorizedError } from "../lib/profile-error";

export function useUpdateUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => updateUserInfo({ username }),
    onSuccess: (_response, username) => {
      const { balances, setSession } = useAuthSessionStore.getState();
      setSession(username, balances);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error) => {
      // Refresh already failed inside the request — end the dead session so
      // protected screens can redirect home.
      if (isUnauthorizedError(error)) {
        useAuthSessionStore.getState().clearSession();
      }
    },
  });
}
