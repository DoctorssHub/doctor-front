"use client";

import ClaimIcon from "@/assets/aside/claimIcon.svg";
import { formatClaimCountdown } from "@/features/daily-claimer/lib/format-claim-countdown";
import Image from "next/image";

import { ClaimCountdownText } from "./ClaimCountdownText";
import type { ClaimButtonContentProps } from "./types";

export function ClaimButtonContent({
  countdownEndsAtMs,
  countdownKey,
  initialCountdownSeconds,
  isAuthenticated,
  isClaimAvailable,
  isLoading,
  isPending,
  onCountdownComplete,
  pointsAmount,
}: ClaimButtonContentProps) {
  if (isPending) {
    return "Claiming...";
  }

  if (isAuthenticated && isLoading) {
    return "Loading...";
  }

  if (isAuthenticated && !isClaimAvailable && initialCountdownSeconds > 0) {
    return (
      <ClaimCountdownText
        endsAtMs={countdownEndsAtMs}
        formatter={formatClaimCountdown}
        key={countdownKey}
        onComplete={onCountdownComplete}
      />
    );
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
