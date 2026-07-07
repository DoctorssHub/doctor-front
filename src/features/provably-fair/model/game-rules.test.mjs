import assert from "node:assert/strict";
import test from "node:test";
import { GAME_RULES, getGameRules } from "./game-rules.ts";

test("getGameRules returns titled rules for every provably fair game", () => {
  for (const game of ["roulette", "keno", "plinko", "dice"]) {
    const rules = getGameRules(game);

    assert.equal(rules.title, "Game Rules");
    assert.ok(rules.steps.length > 0);
    assert.equal(rules, GAME_RULES[game]);
  }
});

test("roulette rules include nested bet type payouts", () => {
  const rouletteRules = getGameRules("roulette");
  const betTypes = rouletteRules.steps[1]?.items ?? [];

  assert.equal(betTypes.length, 7);
  assert.deepEqual(betTypes[0], "Straight (1 number) - pays 36:1");
  assert.deepEqual(
    betTypes[6],
    "Red/Black, Even/Odd, 1-18/19-36 - pays 1:1",
  );
});
