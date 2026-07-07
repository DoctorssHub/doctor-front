import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("./turbo-mode.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const turboMode = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const {
  getPlinkoTurboTimingScale,
  getTurboAutoBetDelay,
  getTurboModeConfig,
  isTurboModeAvailable,
} = turboMode;

test("isTurboModeAvailable excludes roulette and allows the other games", () => {
  assert.equal(isTurboModeAvailable("roulette"), false);
  assert.equal(isTurboModeAvailable("plinko"), true);
  assert.equal(isTurboModeAvailable("keno"), true);
  assert.equal(isTurboModeAvailable("dice"), true);
});

test("getTurboModeConfig exposes game-specific turbo behavior", () => {
  assert.deepEqual(getTurboModeConfig("roulette"), null);
  assert.deepEqual(getTurboModeConfig("dice"), {
    autoBetDelayMs: 300,
    instantResult: true,
  });
  assert.deepEqual(getTurboModeConfig("keno"), {
    autoBetDelayMs: 900,
    instantReveal: true,
  });
  assert.deepEqual(getTurboModeConfig("plinko"), {
    autoBetDelayMs: 300,
    timingScale: 0.35,
  });
});

test("getTurboAutoBetDelay uses per-game delay only when turbo is enabled", () => {
  assert.equal(getTurboAutoBetDelay("dice", 1500, false), 1500);
  assert.equal(getTurboAutoBetDelay("dice", 1500, true), 300);
  assert.equal(getTurboAutoBetDelay("keno", 1900, true), 900);
  assert.equal(getTurboAutoBetDelay("plinko", 500, true), 300);
  assert.equal(getTurboAutoBetDelay("roulette", 2000, true), 2000);
});

test("getPlinkoTurboTimingScale speeds up but does not skip the ball motion", () => {
  assert.equal(getPlinkoTurboTimingScale(false), 1);
  assert.equal(getPlinkoTurboTimingScale(true), 0.35);
});
