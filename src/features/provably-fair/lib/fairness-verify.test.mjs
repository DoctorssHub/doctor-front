import assert from "node:assert/strict";
import test from "node:test";
import {
  verifyDice,
  verifyKeno,
  verifyPlinko,
  verifyRoulette,
} from "./fairness-verify.ts";

const serverSeed =
  "716a69288a0f9acc3f9ddc82a9a01c1695acfd921f0abf7457af77953098b307";
const clientSeed =
  "0dbcd26abdf5906b7e5c27401f42fb71c57c2ed9e878ded36c8e59955dd81e24";
const nonce = 0;

test("verifyDice returns a 0.00 precision roll from seed data", async () => {
  assert.equal(await verifyDice(serverSeed, clientSeed, nonce), 35.9);
});

test("verifyKeno returns ten unique zero-based drawn tiles", async () => {
  assert.deepEqual(await verifyKeno(serverSeed, clientSeed, nonce), [
    14, 0, 23, 24, 25, 13, 9, 33, 1, 16,
  ]);
});

test("verifyPlinko returns the landing bucket for the configured rows", async () => {
  assert.equal(await verifyPlinko(serverSeed, clientSeed, nonce, 8), 4);
});

test("verifyRoulette returns a roulette number from 0 to 36", async () => {
  assert.equal(await verifyRoulette(serverSeed, clientSeed, nonce), 13);
});
