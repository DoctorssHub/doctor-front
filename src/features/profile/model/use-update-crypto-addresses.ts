"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "@/features/auth/model/auth-session-store";
import {
  updateCryptoAddresses,
  type UpdateCryptoAddressesPayload,
} from "../api/profile-api";
import { isUnauthorizedError } from "../lib/profile-error";

export function useUpdateCryptoAddresses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCryptoAddressesPayload) =>
      updateCryptoAddresses(payload),
    onSuccess: () => {
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
