export type DailyClaimerStatusResponse = {
  available: boolean;
  enabled: boolean;
  pointsAmount: number;
  invalidConfig: boolean;
  nextClaimAt: string | null;
  secondsUntilNextClaim: number;
};

export type DailyClaimerClaimResponse = {
  pointsAmount: number;
};
