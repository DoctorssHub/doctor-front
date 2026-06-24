export const KENO_MAX_AUTO_BETS = 100;

type ValidateKenoAutoBetParams = {
  autoBetsAmount: string;
  gameBalance: number;
  isAutoBetsInfinite: boolean;
  maxBet: number;
  minBet: number;
  parsedBetAmount: number;
};

export function validateKenoAutoBet({
  autoBetsAmount,
  gameBalance,
  isAutoBetsInfinite,
  maxBet,
  minBet,
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

  if (parsedBetAmount < minBet) {
    return `Minimum bet is ${minBet.toFixed(2)}`;
  }

  if (parsedBetAmount > maxBet) {
    return `Maximum bet is ${maxBet.toFixed(2)}`;
  }

  if (!isAutoBetsInfinite && parsedBetAmount * autoBetsCount > gameBalance) {
    return `Not enough balance for ${autoBetsCount} auto bets.`;
  }

  return null;
}
