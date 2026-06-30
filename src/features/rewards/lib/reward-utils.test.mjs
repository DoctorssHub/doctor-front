import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRewardsQueryParams,
  REWARDS_DEFAULT_QUERY,
} from "./reward-query.ts";
import {
  mapRewardDetailsResponse,
  parseRewardInlineContent,
} from "./reward-mappers.ts";
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

test("parseRewardInlineContent returns safe structured inline nodes", () => {
  assert.deepEqual(
    parseRewardInlineContent(
      'Use <strong>THE DOCTOR</strong><br><a href="/rewards">register here</a><script>alert(1)</script><img src=x onerror="bad">',
    ),
    [
      { text: "Use ", type: "text" },
      {
        children: [{ text: "THE DOCTOR", type: "text" }],
        type: "strong",
      },
      { type: "lineBreak" },
      {
        children: [{ text: "register here", type: "text" }],
        href: "/rewards",
        type: "link",
      },
    ],
  );
});

test("mapRewardDetailsResponse keeps only paragraph content blocks", () => {
  assert.deepEqual(
    mapRewardDetailsResponse({
      content: {
        blocks: [
          {
            data: { text: "Visible<br>" },
            id: "paragraph-1",
            type: "paragraph",
          },
          {
            data: { text: "Hidden", level: 4 },
            id: "header-1",
            type: "header",
          },
          {
            data: { items: [{ content: "Hidden list" }], style: "unordered" },
            id: "list-1",
            type: "list",
          },
        ],
        time: 1779877516495,
        version: "2.31.6",
      },
      endDate: "2026-07-06T21:00:00.000Z",
      id: "64658e51-27d1-43f6-8753-b4a993d9067a",
      photoUrl: "https://storage.googleapis.com/reward.png",
      shortDescription: "Short",
      title: "Example reward",
    }),
    {
      content: {
        blocks: [
          {
            data: {
              nodes: [
                { text: "Visible", type: "text" },
                { type: "lineBreak" },
              ],
            },
            id: "paragraph-1",
            type: "paragraph",
          },
        ],
        time: 1779877516495,
        version: "2.31.6",
      },
      endDate: "2026-07-06T21:00:00.000Z",
      id: "64658e51-27d1-43f6-8753-b4a993d9067a",
      photoUrl: "https://storage.googleapis.com/reward.png",
      shortDescription: "Short",
      title: "Example reward",
    },
  );
});
