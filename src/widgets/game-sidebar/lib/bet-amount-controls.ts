export type BetAmountControl = "half" | "double" | "max";

export type BetAmountBounds = {
  availableBalance?: number | null;
  maxBet?: string;
  minBet?: string;
};

export function getNextBetAmount(
  currentAmount: string,
  control: BetAmountControl,
  bounds: BetAmountBounds = {},
) {
  const currentValue = readAmount(currentAmount) ?? readAmount(bounds.minBet) ?? 0;
  const minBet = readAmount(bounds.minBet);
  const maxBet = readAmount(bounds.maxBet);
  const upperBound = getUpperBound(maxBet, bounds.availableBalance);
  const nextValue =
    control === "half"
      ? currentValue / 2
      : control === "double"
        ? currentValue * 2
        : upperBound ?? maxBet ?? bounds.availableBalance ?? currentValue;
  const clampedValue = clampBetAmount(nextValue, minBet, upperBound);

  return formatBetAmount(clampedValue);
}

export function formatBetAmountInput(amount: string) {
  const parsedAmount = readAmount(amount);

  return parsedAmount === null ? amount : formatBetAmount(parsedAmount);
}

function readAmount(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue =
    typeof value === "number" ? value : Number(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getUpperBound(maxBet: number | null, availableBalance?: number | null) {
  const validBalance =
    typeof availableBalance === "number" && Number.isFinite(availableBalance)
      ? availableBalance
      : null;

  if (maxBet !== null && validBalance !== null) {
    return Math.min(maxBet, validBalance);
  }

  return maxBet ?? validBalance;
}

function clampBetAmount(
  amount: number,
  minBet: number | null,
  upperBound: number | null,
) {
  let nextAmount = amount;

  if (minBet !== null) {
    nextAmount = Math.max(nextAmount, minBet);
  }

  if (upperBound !== null) {
    nextAmount = Math.min(nextAmount, upperBound);
  }

  return nextAmount;
}

export function formatBetAmount(amount: number) {
  return amount.toFixed(2);
}
