import type { DailyClaimerStatusResponse } from "@/features/daily-claimer/api/daily-claimer-types";

export type ClaimCardProps = {
  isCollapsed?: boolean;
};

export type DailyClaimButtonProps = {
  isCollapsed?: boolean;
};

export type ClaimButtonContentProps = {
  countdownEndsAtMs: number;
  countdownKey: string;
  initialCountdownSeconds: number;
  isAuthenticated: boolean;
  isClaimAvailable: boolean;
  isLoading: boolean;
  isPending: boolean;
  onCountdownComplete: () => void;
  pointsAmount: number;
};

export type ClaimCountdownTextProps = {
  className?: string;
  endsAtMs: number;
  formatter: (seconds: number) => string;
  onComplete: () => void;
};

export type DailyClaimerStatus = DailyClaimerStatusResponse & {
  countdownStartedAtMs: number;
};
