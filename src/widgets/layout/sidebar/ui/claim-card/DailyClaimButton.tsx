"use client";

import ClaimBgCollapsed from "@/assets/aside/claimBgCollapsed.png";
import Image from "next/image";

import { ClaimButtonContent } from "./ClaimButtonContent";
import { ClaimCountdownText } from "./ClaimCountdownText";
import { ClaimToast } from "./ClaimToast";
import {
  formatCollapsedCountdown,
  getClaimAriaLabel,
} from "./claim-card-utils";
import type { DailyClaimButtonProps } from "./types";
import { useDailyClaimButton } from "./useDailyClaimButton";

export function DailyClaimButton({
  isCollapsed = false,
}: DailyClaimButtonProps) {
  const claim = useDailyClaimButton();
  const ariaLabel = getClaimAriaLabel({
    countdownText: claim.countdownText,
    isAuthenticated: claim.isAuthenticated,
    isClaimAvailable: claim.isClaimAvailable,
    pointsAmount: claim.pointsAmount,
    secondsUntilNextClaim: claim.secondsUntilNextClaim,
  });

  if (isCollapsed) {
    return (
      <>
        <button
          aria-label={ariaLabel}
          className="relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          disabled={claim.isAuthenticated && !claim.isClaimAvailable}
          onClick={claim.handleClaim}
          type="button"
        >
          <Image
            alt="Daily reward claim"
            src={ClaimBgCollapsed}
          />
          {claim.shouldShowCountdown ? (
            <ClaimCountdownText
              className="absolute inset-x-1 bottom-1 rounded bg-(--color-page)/80 px-1 text-center text-[10px] font-semibold text-(--color-text-primary)"
              endsAtMs={claim.countdownEndsAtMs}
              formatter={formatCollapsedCountdown}
              key={claim.countdownKey}
              onComplete={claim.handleCountdownComplete}
            />
          ) : null}
        </button>
        <ClaimToast message={claim.toastMessage} />
      </>
    );
  }

  return (
    <>
      <button
        aria-label={ariaLabel}
        className="flex h-8 min-w-[96px] cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-medium text-(--color-page-raised) transition disabled:cursor-not-allowed disabled:opacity-75"
        disabled={claim.isAuthenticated && !claim.isClaimAvailable}
        onClick={claim.handleClaim}
        style={{ backgroundImage: "var(--gradient-claim-panel)" }}
        type="button"
      >
        <ClaimButtonContent
          countdownEndsAtMs={claim.countdownEndsAtMs}
          countdownKey={claim.countdownKey}
          initialCountdownSeconds={claim.secondsUntilNextClaim}
          isAuthenticated={claim.isAuthenticated}
          isClaimAvailable={claim.isClaimAvailable}
          isLoading={claim.isLoading}
          isPending={claim.isPending}
          onCountdownComplete={claim.handleCountdownComplete}
          pointsAmount={claim.pointsAmount}
        />
      </button>
      <ClaimToast message={claim.toastMessage} />
    </>
  );
}
