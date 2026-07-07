import assert from "node:assert/strict";
import test from "node:test";
import { getModalPortalTarget } from "./modal-portal-target.ts";

test("getModalPortalTarget prefers the fullscreen element when present", () => {
  const fullscreenElement = {};
  const body = {};

  assert.equal(
    getModalPortalTarget({ fullscreenElement, body }),
    fullscreenElement,
  );
});

test("getModalPortalTarget falls back to document body outside fullscreen", () => {
  const body = {};

  assert.equal(getModalPortalTarget({ fullscreenElement: null, body }), body);
});
