import type { DiceBetResponse } from "../api/dice-types";
import type { DiceBetRequest } from "../api/dice-types";
import type { DiceAutoConfig } from "../model/dice-game-options";

export const AUTO_BET_DELAY_MS = 1500;

function readPositiveConfigAmount(value: string) {
  const amount = Number(value.replace(/,/g, ""));

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function readConfigPercent(value: string) {
  const percent = Number(value.replace(/,/g, ""));

  return Number.isFinite(percent) && percent > 0 ? percent : 0;
}

export function getDiceBetNetResult(response: DiceBetResponse) {
  const betSize = Number(response.betSize);
  const payout = Number(response.payout);

  if (!Number.isFinite(betSize) || !Number.isFinite(payout)) {
    return 0;
  }

  return response.didWin ? payout - betSize : -betSize;
}

export function getNextAutoBetSize(
  currentBetSize: number,
  initialBetSize: number,
  response: DiceBetResponse,
  config: DiceAutoConfig,
) {
  const mode = response.didWin ? config.onWinMode : config.onLossMode;

  if (mode === "reset") {
    return initialBetSize;
  }

  const percent = readConfigPercent(
    response.didWin ? config.onWinIncrease : config.onLossIncrease,
  );

  return currentBetSize * (1 + percent / 100);
}

export function shouldStopForAutoLimits(
  netProfit: number,
  config: DiceAutoConfig,
) {
  const stopOnProfit = readPositiveConfigAmount(config.stopOnProfit);
  const stopOnLoss = readPositiveConfigAmount(config.stopOnLoss);

  return (
    (stopOnProfit !== null && netProfit >= stopOnProfit) ||
    (stopOnLoss !== null && netProfit <= -stopOnLoss)
  );
}

type RunDiceAutoBetSequenceParams = {
  config: DiceAutoConfig;
  initialBalance: number;
  initialBetSize: number;
  isInfinite: boolean;
  isValidBetSize: (betSize: number, balance: number) => boolean;
  mutateBet: (payload: DiceBetRequest) => Promise<DiceBetResponse>;
  onBetStart?: () => void;
  payload: DiceBetRequest;
  plannedBets: number;
  shouldStop: () => boolean;
  waitForNextBet?: (delayMs: number) => Promise<void>;
};

function waitForNextAutoBet(delayMs: number) {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, delayMs);
  });
}

export async function runDiceAutoBetSequence({
  config,
  initialBalance,
  initialBetSize,
  isInfinite,
  isValidBetSize,
  mutateBet,
  onBetStart,
  payload,
  plannedBets,
  shouldStop,
  waitForNextBet = waitForNextAutoBet,
}: RunDiceAutoBetSequenceParams) {
  let availableBalance = initialBalance;
  let currentBetSize = initialBetSize;
  let remainingBets = plannedBets;
  let netProfit = 0;

  while (!shouldStop() && remainingBets > 0) {
    if (!isValidBetSize(currentBetSize, availableBalance)) {
      break;
    }

    const currentPayload = {
      ...payload,
      betSize: formatAutoBetSize(currentBetSize),
    };

    onBetStart?.();
    const response = await mutateBet(currentPayload);
    const netResult = getDiceBetNetResult(response);

    netProfit += netResult;
    availableBalance += netResult;

    if (!isInfinite) {
      remainingBets -= 1;
    }

    if (
      shouldStop() ||
      remainingBets <= 0 ||
      shouldStopForAutoLimits(netProfit, config)
    ) {
      break;
    }

    currentBetSize = getNextAutoBetSize(
      currentBetSize,
      initialBetSize,
      response,
      config,
    );

    await waitForNextBet(AUTO_BET_DELAY_MS);
  }
}

function formatAutoBetSize(value: number) {
  return value.toFixed(2);
}
