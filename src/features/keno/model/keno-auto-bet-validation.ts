export const KENO_MAX_AUTO_BETS = 100;

type ValidateKenoAutoBetParams = {
  autoBetsAmount: string;
  gameBalance: number;
  isAutoBetsInfinite: boolean;
  parsedBetAmount: number;
};

export function validateKenoAutoBet({
  autoBetsAmount,
  gameBalance,
  isAutoBetsInfinite,
  parsedBetAmount,
}: ValidateKenoAutoBetParams) {
  const autoBetsCount = Number(autoBetsAmount);

  if (
    !isAutoBetsInfinite &&
    (!Number.isInteger(autoBetsCount) || autoBetsCount < 1)
  ) {
    return "Number of Bets must be at least 1.";
  }

  if (!isAutoBetsInfinite && autoBetsCount > KENO_MAX_AUTO_BETS) {
    return `Number of Bets cannot be greater than ${KENO_MAX_AUTO_BETS}.`;
  }

  if (!isAutoBetsInfinite && parsedBetAmount * autoBetsCount > gameBalance) {
    return `Not enough balance for ${autoBetsCount} auto bets.`;
  }

  return null;
}
