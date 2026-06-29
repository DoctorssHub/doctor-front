const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

export function getRewardRemainingMs(endDate: string, nowMs = Date.now()) {
  const endMs = Date.parse(endDate);

  if (!Number.isFinite(endMs)) {
    return 0;
  }

  return Math.max(0, endMs - nowMs);
}

export function formatRewardCountdown(remainingMs: number) {
  const safeMs = Math.max(0, remainingMs);
  const days = Math.floor(safeMs / MS_IN_DAY);
  const hours = Math.floor((safeMs % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((safeMs % MS_IN_HOUR) / MS_IN_MINUTE);

  return `${days}d : ${hours}h : ${minutes}m`;
}
