import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTO_BET_DELAY_MS,
  runDiceAutoBetSequence,
} from "./dice-auto-betting.ts";
import { DEFAULT_DICE_AUTO_CONFIG } from "../model/dice-game-options.ts";

const autoConfig = {
  onWinMode: "reset",
  onWinIncrease: "",
  onLossMode: "reset",
  onLossIncrease: "",
  stopOnProfit: "",
  stopOnLoss: "",
};

function createDiceResponse(payload, didWin = false) {
  return {
    above: payload.above,
    betId: crypto.randomUUID(),
    betSize: payload.betSize,
    createdAt: new Date(0).toISOString(),
    didWin,
    multiplier: 2,
    payout: didWin ? "20" : "0",
    randomValue: 80,
    threshold: payload.threshold,
  };
}

test("runDiceAutoBetSequence places the configured number of bets with a 1.5s delay between them", async () => {
  const payloads = [];
  const delays = [];
  let betStartCount = 0;

  await runDiceAutoBetSequence({
    config: autoConfig,
    initialBalance: 1000,
    initialBetSize: 10,
    isInfinite: false,
    isValidBetSize: () => true,
    mutateBet: async (payload) => {
      payloads.push(payload);
      return createDiceResponse(payload);
    },
    onBetStart: () => {
      betStartCount += 1;
    },
    payload: {
      above: true,
      betSize: "10.00",
      threshold: 50,
    },
    plannedBets: 3,
    shouldStop: () => false,
    waitForNextBet: async (delayMs) => {
      delays.push(delayMs);
    },
  });

  assert.equal(payloads.length, 3);
  assert.equal(betStartCount, 3);
  assert.deepEqual(
    payloads.map((payload) => payload.betSize),
    ["10.00", "10.00", "10.00"],
  );
  assert.deepEqual(delays, [AUTO_BET_DELAY_MS, AUTO_BET_DELAY_MS]);
  assert.equal(AUTO_BET_DELAY_MS, 1500);
});

test("default dice auto config does not stop auto betting after the first losing bet", async () => {
  const payloads = [];

  await runDiceAutoBetSequence({
    config: DEFAULT_DICE_AUTO_CONFIG,
    initialBalance: 1000,
    initialBetSize: 10,
    isInfinite: false,
    isValidBetSize: () => true,
    mutateBet: async (payload) => {
      payloads.push(payload);
      return createDiceResponse(payload, false);
    },
    payload: {
      above: true,
      betSize: "10.00",
      threshold: 50,
    },
    plannedBets: 3,
    shouldStop: () => false,
    waitForNextBet: async () => undefined,
  });

  assert.equal(payloads.length, 3);
});
