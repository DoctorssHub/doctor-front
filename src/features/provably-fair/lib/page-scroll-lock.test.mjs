import assert from "node:assert/strict";
import test from "node:test";
import { lockPageScroll } from "./page-scroll-lock.ts";

test("lockPageScroll hides page overflow and restores previous values", () => {
  const body = { style: { overflow: "auto" } };
  const documentElement = { style: { overflow: "visible" } };

  const unlock = lockPageScroll(body, documentElement);

  assert.equal(body.style.overflow, "hidden");
  assert.equal(documentElement.style.overflow, "hidden");

  unlock();

  assert.equal(body.style.overflow, "auto");
  assert.equal(documentElement.style.overflow, "visible");
});
