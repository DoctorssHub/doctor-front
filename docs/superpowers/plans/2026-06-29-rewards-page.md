# Rewards Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/rewards` page that loads real reward campaigns from `/api/reward/query` and renders them in the existing project style.

**Architecture:** Keep the route thin in `src/app/(main)/rewards/page.tsx`, compose the screen from `src/screens/rewards`, and place API/types/hooks/helpers/UI inside `src/features/rewards`. Use React Query for client-side loading, the local `/api` proxy, and small pure helpers for query params and countdown formatting.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, TanStack React Query 5, Axios.

---

### Task 1: Rewards Helpers And API Contract

**Files:**
- Create: `src/features/rewards/lib/reward-query.ts`
- Create: `src/features/rewards/lib/reward-countdown.ts`
- Create: `src/features/rewards/lib/reward-utils.test.mjs`
- Create: `src/features/rewards/model/types.ts`
- Create: `src/features/rewards/api/rewards-api.ts`

- [ ] **Step 1: Write failing helper tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRewardsQueryParams,
  REWARDS_DEFAULT_QUERY,
} from "./reward-query.ts";
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

test("formatRewardCountdown returns compact days hours minutes format", () => {
  assert.equal(formatRewardCountdown(98646000), "1d : 3h : 24m");
});

test("formatRewardCountdown clamps expired rewards to zero", () => {
  assert.equal(formatRewardCountdown(-1000), "0d : 0h : 0m");
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --experimental-transform-types src/features/rewards/lib/reward-utils.test.mjs`

Expected: FAIL because `reward-query.ts` and `reward-countdown.ts` do not exist.

- [ ] **Step 3: Implement helpers, types, and API**

Create typed helpers, response mapping, and `getRewards()` using the existing `/api` proxy.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --experimental-transform-types src/features/rewards/lib/reward-utils.test.mjs`

Expected: PASS.

### Task 2: Rewards UI And Route

**Files:**
- Create: `src/features/rewards/model/use-rewards.ts`
- Create: `src/features/rewards/ui/RewardsPageView.tsx`
- Create: `src/features/rewards/ui/RewardsToolbar.tsx`
- Create: `src/features/rewards/ui/RewardCard.tsx`
- Create: `src/features/rewards/ui/RewardsGrid.tsx`
- Create: `src/features/rewards/index.ts`
- Create: `src/screens/rewards/RewardsScreen.tsx`
- Create: `src/screens/rewards/index.ts`
- Create: `src/app/(main)/rewards/page.tsx`
- Modify: `src/widgets/layout/sidebar/model/nav-items.ts`
- Modify: `src/screens/index.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Implement page UI**

Build a responsive dark page matching existing surfaces, with title, search input, sort menu, loading skeletons, empty/error states, and reward cards.

- [ ] **Step 2: Wire route and navigation**

Expose `RewardsScreen`, add the `/rewards` route, update sidebar Rewards href, and allow `storage.googleapis.com` remote images.

- [ ] **Step 3: Verify**

Run: `npm run lint`

Expected: PASS.
