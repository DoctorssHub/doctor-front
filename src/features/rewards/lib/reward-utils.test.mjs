import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRewardsQueryParams,
  REWARDS_DEFAULT_QUERY,
} from "./reward-query.ts";
import { getRewardsPaginationItems } from "./reward-pagination.ts";
import { formatRewardCountdown } from "./reward-countdown.ts";

test("buildRewardsQueryParams applies defaults and trims search", () => {
  assert.deepEqual(
    buildRewardsQueryParams({ page: 0, search: "  mail  ", take: 99 }),
    {
      page: 1,
      search: "mail",
      sort: REWARDS_DEFAULT_QUERY.sort,
      take: 40,
    },
  );
});

test("buildRewardsQueryParams omits empty search", () => {
  assert.deepEqual(buildRewardsQueryParams({ search: "   " }), {
    page: REWARDS_DEFAULT_QUERY.page,
    sort: REWARDS_DEFAULT_QUERY.sort,
    take: REWARDS_DEFAULT_QUERY.take,
  });
});

test("formatRewardCountdown returns compact days hours minutes format", () => {
  assert.equal(formatRewardCountdown(98646000), "1d : 3h : 24m");
});

test("formatRewardCountdown clamps expired rewards to zero", () => {
  assert.equal(formatRewardCountdown(-1000), "0d : 0h : 0m");
});

test("getRewardsPaginationItems shows the first page group and last page", () => {
  assert.deepEqual(getRewardsPaginationItems(1, 34), [
    1,
    2,
    3,
    4,
    "ellipsis",
    34,
  ]);
});

test("getRewardsPaginationItems shows ellipses around a middle page", () => {
  assert.deepEqual(getRewardsPaginationItems(18, 34), [
    1,
    "ellipsis",
    17,
    18,
    19,
    "ellipsis",
    34,
  ]);
});
