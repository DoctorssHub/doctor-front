"use client";

import ClaimBg from "@/assets/aside/claim-bg.png";
import ClaimBgCollapsed from "@/assets/aside/claimBgCollapsed.png";
import ClaimIcon from "@/assets/aside/claimIcon.svg";
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
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type ClaimCardProps = {
  isCollapsed?: boolean;
};

type ClaimButtonContentProps = {
  countdownText: string;
  isAuthenticated: boolean;
  isClaimAvailable: boolean;
  isLoading: boolean;
  isPending: boolean;
  pointsAmount: number;
  secondsUntilNextClaim: number;
};

export function ClaimCard({ isCollapsed = false }: ClaimCardProps) {
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
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const statusQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: async () => (await getDailyClaimerStatus()).data,
    queryKey: ["daily-claimer", "status"],
  });

  const status = statusQuery.data;
  const pointsAmount = status?.pointsAmount ?? 30;
  const secondsUntilNextClaim = useMemo(() => {
    if (!status) {
      return 0;
    }

    const elapsedSeconds = Math.floor((nowMs - statusQuery.dataUpdatedAt) / 1000);

    return Math.max(0, status.secondsUntilNextClaim - elapsedSeconds);
  }, [nowMs, status, statusQuery.dataUpdatedAt]);
  const isClaimerEnabled = status?.enabled !== false && !status?.invalidConfig;
  const isClaimAvailable = status
    ? isClaimerEnabled &&
      (Boolean(status.available) || secondsUntilNextClaim <= 0)
    : false;

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
    if (secondsUntilNextClaim <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [secondsUntilNextClaim]);

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

  if (isCollapsed) {
    return (
      <>
        <button
          aria-label={getClaimAriaLabel({
            countdownText,
            isAuthenticated,
            isClaimAvailable,
            pointsAmount,
            secondsUntilNextClaim,
          })}
          className="relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isAuthenticated && !isClaimAvailable}
          type="button"
          onClick={handleClaim}
        >
          <Image
            alt="Daily reward claim"
            src={ClaimBgCollapsed}
          />
          {isAuthenticated && secondsUntilNextClaim > 0 ? (
            <span className="absolute inset-x-1 bottom-1 rounded bg-(--color-page)/80 px-1 text-center text-[10px] font-semibold text-(--color-text-primary)">
              {formatCollapsedCountdown(secondsUntilNextClaim)}
            </span>
          ) : null}
        </button>
        <ClaimToast message={toastMessage} />
      </>
    );
  }

  return (
    <>
      <div className="relative max-tablet:h-[124px] max-tablet:w-[327px]">
        <Image
          alt="Daily claimer reward background"
          className="max-tablet:h-full max-tablet:w-full max-tablet:object-cover"
          src={ClaimBg}
        />
        <div className="absolute top-0 flex h-full flex-col justify-between p-3">
          <h3 className="text-[16px] font-semibold text-(--color-text-primary)">
            DAILY <br /> CLAIMER!
          </h3>
          <button
            aria-label={getClaimAriaLabel({
              countdownText,
              isAuthenticated,
              isClaimAvailable,
              pointsAmount,
              secondsUntilNextClaim,
            })}
            className="flex h-8 min-w-[96px] cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-medium text-(--color-page-raised) transition disabled:cursor-not-allowed disabled:opacity-75"
            disabled={isAuthenticated && !isClaimAvailable}
            style={{ backgroundImage: "var(--gradient-claim-panel)" }}
            type="button"
            onClick={handleClaim}
          >
            <ClaimButtonContent
              countdownText={countdownText}
              isAuthenticated={isAuthenticated}
              isClaimAvailable={isClaimAvailable}
              isLoading={statusQuery.isLoading}
              isPending={claimMutation.isPending}
              pointsAmount={pointsAmount}
              secondsUntilNextClaim={secondsUntilNextClaim}
            />
          </button>
        </div>
      </div>
      <ClaimToast message={toastMessage} />
    </>
  );
}

function ClaimButtonContent({
  countdownText,
  isAuthenticated,
  isClaimAvailable,
  isLoading,
  isPending,
  pointsAmount,
  secondsUntilNextClaim,
}: ClaimButtonContentProps) {
  if (isPending) {
    return "Claiming...";
  }

  if (isAuthenticated && isLoading) {
    return "Loading...";
  }

  if (isAuthenticated && !isClaimAvailable && secondsUntilNextClaim > 0) {
    return countdownText;
  }

  return (
    <>
      Claim
      <Image
        alt="Reward coin"
        className="ml-1 mr-0.5"
        src={ClaimIcon}
      />
      {pointsAmount}
    </>
  );
}

function ClaimToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-[120] rounded-lg border border-(--color-brand)/40 bg-(--color-page-raised) px-4 py-3 text-[14px] font-semibold text-(--color-text-primary) shadow-[0_16px_40px_rgb(0_0_0/45%)] [animation:dice-mode-panel-in_180ms_cubic-bezier(0.22,1,0.36,1)_both]">
      {message}
    </div>
  );
}

function formatCollapsedCountdown(seconds: number) {
  const totalMinutes = Math.ceil(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes}m`;
}

function getClaimAriaLabel({
  countdownText,
  isAuthenticated,
  isClaimAvailable,
  pointsAmount,
  secondsUntilNextClaim,
}: {
  countdownText: string;
  isAuthenticated: boolean;
  isClaimAvailable: boolean;
  pointsAmount: number;
  secondsUntilNextClaim: number;
}) {
  if (!isAuthenticated) {
    return "Log in to claim daily reward";
  }

  if (!isClaimAvailable && secondsUntilNextClaim > 0) {
    return `Daily reward available in ${countdownText}`;
  }

  return `Claim ${pointsAmount} daily coins`;
}
