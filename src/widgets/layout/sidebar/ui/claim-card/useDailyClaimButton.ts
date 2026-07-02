"use client";

import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
  readUserBalances,
  readUsername,
} from "@/features/auth/lib/read-auth-response";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import {
  claimDailyPoints,
  getDailyClaimerStatus,
} from "@/features/daily-claimer/api/daily-claimer-api";
import { formatClaimCountdown } from "@/features/daily-claimer/lib/format-claim-countdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { DailyClaimerStatus } from "./types";

export function useDailyClaimButton() {
  const queryClient = useQueryClient();
  const { openAuthModal } = useAuthModalStore(
    useShallow((state) => ({
      openAuthModal: state.openAuthModal,
    })),
  );
  const { isAuthenticated, setSession, username } = useAuthSessionStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      setSession: state.setSession,
      username: state.username,
    })),
  );
  const [completedCountdownKey, setCompletedCountdownKey] = useState<
    string | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const statusQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: async (): Promise<DailyClaimerStatus> => {
      const response = await getDailyClaimerStatus();

      return {
        ...response.data,
        countdownStartedAtMs: Date.now(),
      };
    },
    queryKey: ["daily-claimer", "status"],
  });

  const status = statusQuery.data;
  const pointsAmount = status?.pointsAmount ?? 30;
  const secondsUntilNextClaim = status?.secondsUntilNextClaim ?? 0;
  const countdownStartedAtMs = status?.countdownStartedAtMs ?? 0;
  const countdownEndsAtMs =
    countdownStartedAtMs + secondsUntilNextClaim * 1000;
  const countdownKey = `${countdownStartedAtMs}-${secondsUntilNextClaim}`;
  const isCountdownComplete =
    secondsUntilNextClaim <= 0 || completedCountdownKey === countdownKey;
  const isClaimerEnabled = status?.enabled !== false && !status?.invalidConfig;
  const isClaimAvailable = status
    ? isClaimerEnabled &&
      (Boolean(status.available) ||
        secondsUntilNextClaim <= 0 ||
        isCountdownComplete)
    : false;
  const shouldShowCountdown =
    isAuthenticated && !isClaimAvailable && secondsUntilNextClaim > 0;

  const claimMutation = useMutation({
    mutationFn: async () => (await claimDailyPoints()).data,
    onSuccess: async (response) => {
      setToastMessage(`${response.pointsAmount} coins credited`);
      await queryClient.invalidateQueries({
        queryKey: ["daily-claimer", "status"],
      });

      try {
        const meResponse = await getCurrentUser();
        const nextUsername = readUsername(meResponse.data) ?? username;
        const nextBalances = readUserBalances(meResponse.data);

        queryClient.setQueryData(["me"], meResponse.data);

        if (nextUsername) {
          setSession(nextUsername, nextBalances);
        }
      } catch {
        await queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  const countdownText = useMemo(
    () => formatClaimCountdown(secondsUntilNextClaim),
    [secondsUntilNextClaim],
  );
  const handleCountdownComplete = useCallback(() => {
    setCompletedCountdownKey(countdownKey);
  }, [countdownKey]);

  function handleClaim() {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!isClaimAvailable || claimMutation.isPending) {
      return;
    }

    claimMutation.mutate();
  }

  return {
    countdownEndsAtMs,
    countdownKey,
    countdownText,
    handleClaim,
    handleCountdownComplete,
    isAuthenticated,
    isClaimAvailable,
    isLoading: statusQuery.isLoading,
    isPending: claimMutation.isPending,
    pointsAmount,
    secondsUntilNextClaim,
    shouldShowCountdown,
    toastMessage,
  };
}
