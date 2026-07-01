export function formatCollapsedCountdown(seconds: number) {
  const totalMinutes = Math.ceil(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes}m`;
}

export function getClaimAriaLabel({
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

export function getRemainingCountdownSeconds(endsAtMs: number) {
  return Math.max(0, Math.ceil((endsAtMs - Date.now()) / 1000));
}
