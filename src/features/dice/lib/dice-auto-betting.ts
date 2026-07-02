import type { DiceBetResponse } from "../api/dice-types";
import type { DiceAutoConfig } from "../model/dice-game-options";

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