# Bet History Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable bet history table that supports profile history, all-games live bets, and current-game live bets.

**Architecture:** Keep data and UI separated. Domain types and formatters live in `src/entities/bet`, API/query behavior lives in `src/features/bet-history`, and the composed table widget lives in `src/widgets/bet-history`. The Plinko screen only renders the widget below the existing game section with `variant="game-live"` and `game="plinko"`.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Tailwind CSS 4, TanStack React Query 5, Axios through the local `/api` proxy.

---

## File Structure

- Modify: `src/entities/bet/model/types.ts`
  - Add reusable game and bet-history item types.
- Create: `src/entities/bet/lib/formatters.ts`
  - Format multiplier, dates, and currency-like strings for table display.
- Create: `src/features/bet-history/model/types.ts`
  - Define variants, filters, query params, response shape, and UI tab types.
- Create: `src/features/bet-history/api/bet-history-api.ts`
  - Fetch history through `/api` with auth retry support.
- Create: `src/features/bet-history/model/useBetHistory.ts`
  - Wrap the API with `useQuery` and stable query keys.
- Create: `src/widgets/bet-history/model/config.ts`
  - Keep game tabs, live tabs, column labels, and default limits together.
- Create: `src/widgets/bet-history/ui/BetHistoryAmount.tsx`
  - Render the green token marker plus amount text.
- Create: `src/widgets/bet-history/ui/BetHistoryTabs.tsx`
  - Render profile game tabs or live category tabs.
- Create: `src/widgets/bet-history/ui/BetHistoryToolbar.tsx`
  - Render profile search and sort controls.
- Create: `src/widgets/bet-history/ui/BetHistoryRows.tsx`
  - Render table header, rows, loading, empty, and error states.
- Create: `src/widgets/bet-history/ui/BetHistoryPagination.tsx`
  - Render profile page-number pagination.
- Create: `src/widgets/bet-history/ui/BetHistoryTable.tsx`
  - Client component that owns filter state, calls `useBetHistory`, and composes the UI.
- Create: `src/widgets/bet-history/index.ts`
  - Export the public widget.
- Modify: `src/widgets/index.ts`
  - Export `bet-history` if this file is used as a widget barrel.
- Modify: `src/screens/plinko/ui/PlinkoScreen.tsx`
  - Render `BetHistoryTable` under the existing game shell.

---

### Task 1: Domain Types And Formatters

**Files:**
- Modify: `src/entities/bet/model/types.ts`
- Create: `src/entities/bet/lib/formatters.ts`

- [ ] **Step 1: Extend bet domain types**

Replace `src/entities/bet/model/types.ts` with:

```ts
export type Bet = {
  betId: string;
  betSize: string;
  bucketIndex: number;
  createdAt: string;
  payout: string;
  multiplier: number;
};

export type GameType = "roulette" | "keno" | "plinko" | "dice";

export type BetHistoryUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type BetHistoryItem = {
  id: string;
  user: BetHistoryUser;
  game: GameType;
  betAmount: string;
  multiplier: number;
  prize: string;
  createdAt: string;
};
```

- [ ] **Step 2: Add bet display formatters**

Create `src/entities/bet/lib/formatters.ts`:

```ts
export function formatBetMultiplier(multiplier: number) {
  return `x${multiplier.toFixed(2)}`;
}

export function formatBetDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatBetAmount(value: string) {
  return value;
}
```

- [ ] **Step 3: Run lint for the touched domain files**

Run: `npm run lint`

Expected: PASS with no errors from `src/entities/bet/model/types.ts` or `src/entities/bet/lib/formatters.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/entities/bet/model/types.ts src/entities/bet/lib/formatters.ts
git commit -m "feat: add bet history domain types"
```

---

### Task 2: Bet History API And Query Hook

**Files:**
- Create: `src/features/bet-history/model/types.ts`
- Create: `src/features/bet-history/api/bet-history-api.ts`
- Create: `src/features/bet-history/model/useBetHistory.ts`

- [ ] **Step 1: Define query and response types**

Create `src/features/bet-history/model/types.ts`:

```ts
import type { BetHistoryItem, GameType } from "@/entities/bet/model/types";

export type BetHistoryVariant = "profile" | "games-live" | "game-live";

export type BetHistoryLiveCategory = "all" | "high-rollers" | "lucky-bets";

export type BetHistorySort = "date";

export type BetHistoryQueryParams =
  | {
      variant: "profile";
      game?: GameType;
      page: number;
      search: string;
      sort: BetHistorySort;
      userId?: string;
    }
  | {
      variant: "games-live";
      category: BetHistoryLiveCategory;
      limit: number;
      page: number;
    }
  | {
      variant: "game-live";
      category: BetHistoryLiveCategory;
      game: GameType;
      limit: number;
      page: number;
    };

export type BetHistoryResponse = {
  items: BetHistoryItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};
```

- [ ] **Step 2: Add API adapter**

Create `src/features/bet-history/api/bet-history-api.ts`:

```ts
import type { BetHistoryResponse, BetHistoryQueryParams } from "../model/types";
import { plinkoClient, requestWithAuthRetry } from "@/features/plinko/api/plinko-client";

export async function getBetHistory(params: BetHistoryQueryParams) {
  const response = await requestWithAuthRetry(() =>
    plinkoClient.get<BetHistoryResponse>("/bets/history", {
      params: createBetHistoryRequestParams(params),
    }),
  );

  return response.data;
}

function createBetHistoryRequestParams(params: BetHistoryQueryParams) {
  if (params.variant === "profile") {
    return {
      scope: "user",
      game: params.game,
      page: params.page,
      search: params.search || undefined,
      sort: params.sort,
      userId: params.userId,
    };
  }

  if (params.variant === "games-live") {
    return {
      scope: "live",
      category: params.category,
      limit: params.limit,
      page: params.page,
    };
  }

  return {
    scope: "game",
    category: params.category,
    game: params.game,
    limit: params.limit,
    page: params.page,
  };
}
```

- [ ] **Step 3: Add React Query hook**

Create `src/features/bet-history/model/useBetHistory.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { getBetHistory } from "../api/bet-history-api";
import type { BetHistoryQueryParams } from "./types";

export function useBetHistory(params: BetHistoryQueryParams) {
  return useQuery({
    queryKey: ["bet-history", params],
    queryFn: () => getBetHistory(params),
    placeholderData: (previousData) => previousData,
  });
}
```

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: PASS. If lint flags import formatting, apply the repo's existing formatting style and rerun.

- [ ] **Step 5: Commit**

```bash
git add src/features/bet-history/model/types.ts src/features/bet-history/api/bet-history-api.ts src/features/bet-history/model/useBetHistory.ts
git commit -m "feat: add bet history query API"
```

---

### Task 3: Static Table UI Pieces

**Files:**
- Create: `src/widgets/bet-history/model/config.ts`
- Create: `src/widgets/bet-history/ui/BetHistoryAmount.tsx`
- Create: `src/widgets/bet-history/ui/BetHistoryTabs.tsx`
- Create: `src/widgets/bet-history/ui/BetHistoryToolbar.tsx`
- Create: `src/widgets/bet-history/ui/BetHistoryRows.tsx`
- Create: `src/widgets/bet-history/ui/BetHistoryPagination.tsx`

- [ ] **Step 1: Add widget config**

Create `src/widgets/bet-history/model/config.ts`:

```ts
import type { GameType } from "@/entities/bet/model/types";
import type { BetHistoryLiveCategory } from "@/features/bet-history/model/types";

export type GameTab = {
  label: string;
  value?: GameType;
};

export type LiveTab = {
  label: string;
  value: BetHistoryLiveCategory;
};

export const BET_HISTORY_GAME_TABS: GameTab[] = [
  { label: "All" },
  { label: "Roulette", value: "roulette" },
  { label: "Keno", value: "keno" },
  { label: "Plinko", value: "plinko" },
  { label: "Dice", value: "dice" },
];

export const BET_HISTORY_LIVE_TABS: LiveTab[] = [
  { label: "All Bets", value: "all" },
  { label: "High Rollers", value: "high-rollers" },
  { label: "Lucky Bets", value: "lucky-bets" },
];

export const BET_HISTORY_DEFAULT_LIMIT = 8;
```

- [ ] **Step 2: Add amount component**

Create `src/widgets/bet-history/ui/BetHistoryAmount.tsx`:

```tsx
import { formatBetAmount } from "@/entities/bet/lib/formatters";

type BetHistoryAmountProps = {
  value: string;
};

export function BetHistoryAmount({ value }: BetHistoryAmountProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-white">
      <span className="flex size-3.5 items-center justify-center rounded-full bg-[#22f58a] text-[9px] font-black text-[#062414]">
        $
      </span>
      <span>{formatBetAmount(value)}</span>
    </span>
  );
}
```

- [ ] **Step 3: Add tabs component**

Create `src/widgets/bet-history/ui/BetHistoryTabs.tsx`:

```tsx
import type { GameType } from "@/entities/bet/model/types";
import type { BetHistoryLiveCategory, BetHistoryVariant } from "@/features/bet-history/model/types";
import { BET_HISTORY_GAME_TABS, BET_HISTORY_LIVE_TABS } from "../model/config";

type BetHistoryTabsProps = {
  activeGame?: GameType;
  activeLiveCategory: BetHistoryLiveCategory;
  onGameChange: (game?: GameType) => void;
  onLiveCategoryChange: (category: BetHistoryLiveCategory) => void;
  variant: BetHistoryVariant;
};

export function BetHistoryTabs({
  activeGame,
  activeLiveCategory,
  onGameChange,
  onLiveCategoryChange,
  variant,
}: BetHistoryTabsProps) {
  if (variant === "profile") {
    return (
      <div className="flex flex-wrap items-center gap-4">
        {BET_HISTORY_GAME_TABS.map((tab) => {
          const isActive = tab.value === activeGame;

          return (
            <button
              className={`h-10 rounded-md px-4 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#151a24] text-white"
                  : "text-white/70 hover:bg-[#111722] hover:text-white"
              }`}
              key={tab.label}
              onClick={() => onGameChange(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-lg bg-[#0f1420] p-1">
      {BET_HISTORY_LIVE_TABS.map((tab) => {
        const isActive = tab.value === activeLiveCategory;

        return (
          <button
            className={`h-10 rounded-md px-4 text-sm font-semibold transition ${
              isActive
                ? "bg-[#181d29] text-white"
                : "text-white/70 hover:text-white"
            }`}
            key={tab.value}
            onClick={() => onLiveCategoryChange(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Add profile toolbar**

Create `src/widgets/bet-history/ui/BetHistoryToolbar.tsx`:

```tsx
type BetHistoryToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function BetHistoryToolbar({
  search,
  onSearchChange,
}: BetHistoryToolbarProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
      <label className="flex h-10 flex-1 items-center rounded-md border border-[#171d29] bg-[#0f1420] px-3 text-xs text-white/50">
        <span className="mr-2 text-white/35">⌕</span>
        <input
          className="w-full bg-transparent text-white outline-none placeholder:text-white/35"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Enter text"
          type="search"
          value={search}
        />
      </label>
      <button
        className="h-10 rounded-md bg-[#0f1420] px-4 text-left text-xs text-white/60 md:min-w-32"
        type="button"
      >
        Sort by: <span className="font-semibold text-[#22f58a]">Date</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Add rows component**

Create `src/widgets/bet-history/ui/BetHistoryRows.tsx`:

```tsx
import { formatBetDateTime, formatBetMultiplier } from "@/entities/bet/lib/formatters";
import type { BetHistoryItem } from "@/entities/bet/model/types";
import { BetHistoryAmount } from "./BetHistoryAmount";

type BetHistoryRowsProps = {
  error: Error | null;
  isLoading: boolean;
  items: BetHistoryItem[];
  onRetry: () => void;
};

export function BetHistoryRows({
  error,
  isLoading,
  items,
  onRetry,
}: BetHistoryRowsProps) {
  if (isLoading) {
    return (
      <div className="mt-5 space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className="h-9 animate-pulse rounded bg-[#101620]"
            key={index}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 rounded-md border border-[#2a1720] bg-[#140d14] p-4 text-sm text-white">
        <p>Unable to load bets history.</p>
        <button
          className="mt-3 h-9 rounded-md bg-[#242936] px-4 text-sm font-semibold"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-5 rounded-md bg-[#0f1420] p-6 text-center text-sm text-white/60">
        No bets found.
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-180 border-separate border-spacing-y-0 text-left text-[11px] text-white">
        <thead className="text-white/65">
          <tr>
            <th className="px-3 py-3 font-medium">User</th>
            <th className="px-3 py-3 font-medium">Game</th>
            <th className="px-3 py-3 font-medium">Bet</th>
            <th className="px-3 py-3 font-medium">Multiplier</th>
            <th className="px-3 py-3 font-medium">Prize</th>
            <th className="px-3 py-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              className={index % 2 === 0 ? "bg-[#101620]" : "bg-transparent"}
              key={item.id}
            >
              <td className="px-3 py-3">
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded-full bg-[#143d32]" />
                  <span>{item.user.name}</span>
                </span>
              </td>
              <td className="px-3 py-3 capitalize">{item.game}</td>
              <td className="px-3 py-3">
                <BetHistoryAmount value={item.betAmount} />
              </td>
              <td className="px-3 py-3">{formatBetMultiplier(item.multiplier)}</td>
              <td className="px-3 py-3">
                <BetHistoryAmount value={item.prize} />
              </td>
              <td className="px-3 py-3">{formatBetDateTime(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 6: Add pagination component**

Create `src/widgets/bet-history/ui/BetHistoryPagination.tsx`:

```tsx
type BetHistoryPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function BetHistoryPagination({
  page,
  totalPages,
  onPageChange,
}: BetHistoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = Array.from(
    { length: Math.min(totalPages, 4) },
    (_, index) => index + 1,
  );

  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-sm text-white">
      <button
        className="size-8 rounded-md text-white/50 disabled:opacity-30"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        ‹
      </button>
      {visiblePages.map((visiblePage) => (
        <button
          className={`size-8 rounded-md ${
            page === visiblePage ? "bg-[#242936]" : "text-white/80"
          }`}
          key={visiblePage}
          onClick={() => onPageChange(visiblePage)}
          type="button"
        >
          {visiblePage}
        </button>
      ))}
      {totalPages > 4 ? <span className="px-1 text-white/60">...</span> : null}
      {totalPages > 4 ? (
        <button
          className="size-8 rounded-md text-white/80"
          onClick={() => onPageChange(totalPages)}
          type="button"
        >
          {totalPages}
        </button>
      ) : null}
      <button
        className="size-8 rounded-md text-white/50 disabled:opacity-30"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        ›
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Run lint**

Run: `npm run lint`

Expected: PASS. Fix any Tailwind or TypeScript syntax errors before continuing.

- [ ] **Step 8: Commit**

```bash
git add src/widgets/bet-history/model/config.ts src/widgets/bet-history/ui/BetHistoryAmount.tsx src/widgets/bet-history/ui/BetHistoryTabs.tsx src/widgets/bet-history/ui/BetHistoryToolbar.tsx src/widgets/bet-history/ui/BetHistoryRows.tsx src/widgets/bet-history/ui/BetHistoryPagination.tsx
git commit -m "feat: add bet history table UI pieces"
```

---

### Task 4: Compose The BetHistoryTable Widget

**Files:**
- Create: `src/widgets/bet-history/ui/BetHistoryTable.tsx`
- Create: `src/widgets/bet-history/index.ts`
- Modify: `src/widgets/index.ts`

- [ ] **Step 1: Add composed table component**

Create `src/widgets/bet-history/ui/BetHistoryTable.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { GameType } from "@/entities/bet/model/types";
import type { BetHistoryLiveCategory, BetHistoryVariant } from "@/features/bet-history/model/types";
import { useBetHistory } from "@/features/bet-history/model/useBetHistory";
import { BET_HISTORY_DEFAULT_LIMIT } from "../model/config";
import { BetHistoryPagination } from "./BetHistoryPagination";
import { BetHistoryRows } from "./BetHistoryRows";
import { BetHistoryTabs } from "./BetHistoryTabs";
import { BetHistoryToolbar } from "./BetHistoryToolbar";

type BetHistoryTableProps = {
  className?: string;
  game?: GameType;
  title?: string;
  userId?: string;
  variant: BetHistoryVariant;
};

export function BetHistoryTable({
  className = "",
  game,
  title,
  userId,
  variant,
}: BetHistoryTableProps) {
  const [activeGame, setActiveGame] = useState<GameType | undefined>();
  const [activeLiveCategory, setActiveLiveCategory] =
    useState<BetHistoryLiveCategory>("all");
  const [limit, setLimit] = useState(BET_HISTORY_DEFAULT_LIMIT);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    if (variant === "profile") {
      return {
        variant,
        game: activeGame,
        page,
        search,
        sort: "date" as const,
        userId,
      };
    }

    if (variant === "games-live") {
      return {
        variant,
        category: activeLiveCategory,
        limit,
        page: 1,
      };
    }

    return {
      variant,
      category: activeLiveCategory,
      game: game || "plinko",
      limit,
      page: 1,
    };
  }, [activeGame, activeLiveCategory, game, limit, page, search, userId, variant]);

  const { data, error, isFetching, isLoading, refetch } =
    useBetHistory(queryParams);
  const items = data?.items ?? [];
  const resolvedTitle =
    title ?? (variant === "profile" ? "Bets history" : "Bet Live");
  const shouldShowTitle = variant !== "game-live" || Boolean(title);
  const shouldShowToolbar = variant === "profile";
  const shouldShowPagination = variant === "profile";
  const shouldShowMore = variant !== "profile";

  function handleGameChange(nextGame?: GameType) {
    setActiveGame(nextGame);
    setPage(1);
  }

  function handleLiveCategoryChange(category: BetHistoryLiveCategory) {
    setActiveLiveCategory(category);
    setLimit(BET_HISTORY_DEFAULT_LIMIT);
  }

  return (
    <section className={`mx-auto w-full max-w-240 text-white ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {shouldShowTitle ? (
            <h2 className="text-xl font-bold">{resolvedTitle}</h2>
          ) : null}
          <BetHistoryTabs
            activeGame={activeGame}
            activeLiveCategory={activeLiveCategory}
            onGameChange={handleGameChange}
            onLiveCategoryChange={handleLiveCategoryChange}
            variant={variant}
          />
        </div>

        {shouldShowToolbar ? (
          <BetHistoryToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        ) : null}
      </div>

      <BetHistoryRows
        error={error instanceof Error ? error : null}
        isLoading={isLoading}
        items={items}
        onRetry={() => {
          void refetch();
        }}
      />

      {shouldShowPagination ? (
        <BetHistoryPagination
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      ) : null}

      {shouldShowMore ? (
        <div className="mt-6 flex justify-center">
          <button
            className="h-11 rounded-md bg-[#242936] px-6 text-sm font-bold text-white transition hover:bg-[#2e3442] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
            onClick={() => setLimit((currentLimit) => currentLimit + BET_HISTORY_DEFAULT_LIMIT)}
            type="button"
          >
            Show more
          </button>
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: Add widget public export**

Create `src/widgets/bet-history/index.ts`:

```ts
export { BetHistoryTable } from "./ui/BetHistoryTable";
```

- [ ] **Step 3: Update widgets barrel if it is used**

If `src/widgets/index.ts` is empty or already exports other widgets, make sure it includes:

```ts
export { BetHistoryTable } from "./bet-history";
```

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: PASS. If the lint rule rejects `error instanceof Error` because query errors are unknown, keep the explicit guard instead of using `any`.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/bet-history/ui/BetHistoryTable.tsx src/widgets/bet-history/index.ts src/widgets/index.ts
git commit -m "feat: compose bet history widget"
```

---

### Task 5: Render Game-Live Table Under Plinko

**Files:**
- Modify: `src/screens/plinko/ui/PlinkoScreen.tsx`

- [ ] **Step 1: Import the widget**

Add this import to `src/screens/plinko/ui/PlinkoScreen.tsx`:

```tsx
import { BetHistoryTable } from "@/widgets/bet-history";
```

- [ ] **Step 2: Render table below the existing game section**

In `PlinkoScreen`, keep the current game `<section>` unchanged and add the table after it:

```tsx
  return (
    <main className="bg-[#080c17] p-4 text-white max-[767px]:p-2 md:p-5">
      <section className="mx-auto flex min-h-131 max-w-240 flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0/28%)] min-[1024px]:flex-row max-[1023px]:min-h-0">
        <PlinkoSidebar
          configErrorMessage={configErrorMessage}
          hasGameConfigError={hasGameConfigError}
          isGameConfigLoading={isGameConfigLoading}
          isGameConfigReady={isGameConfigReady}
          maxBet={plinkoConfig.maxBet}
          minBet={plinkoConfig.minBet}
        />
        <PlinkoBoardPanel config={plinkoConfig} />
      </section>
      <BetHistoryTable
        className="mt-8"
        game="plinko"
        variant="game-live"
      />
    </main>
  );
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/screens/plinko/ui/PlinkoScreen.tsx
git commit -m "feat: show live bet history under plinko"
```

---

### Task 6: Add Mock Fallback Only If Backend Is Not Ready

**Files:**
- Modify: `src/features/bet-history/api/bet-history-api.ts`

- [ ] **Step 1: Confirm backend availability**

Run the app with `npm run dev`, open the Plinko page, and inspect the request to `/api/bets/history`.

Expected if backend is ready: HTTP 200 and rows render.

Expected if backend is not ready: HTTP 404 or a backend contract mismatch.

- [ ] **Step 2: Add temporary development fallback only when the endpoint is missing**

If the endpoint is missing and the UI must be reviewable before backend work is complete, add this helper to `src/features/bet-history/api/bet-history-api.ts`:

```ts
import axios from "axios";
import type { BetHistoryItem } from "@/entities/bet/model/types";
```

Then update `getBetHistory`:

```ts
export async function getBetHistory(params: BetHistoryQueryParams) {
  try {
    const response = await requestWithAuthRetry(() =>
      plinkoClient.get<BetHistoryResponse>("/bets/history", {
        params: createBetHistoryRequestParams(params),
      }),
    );

    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "production" || !isMissingHistoryEndpoint(error)) {
      throw error;
    }

    return createMockBetHistoryResponse(params);
  }
}

function isMissingHistoryEndpoint(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function createMockBetHistoryResponse(
  params: BetHistoryQueryParams,
): BetHistoryResponse {
  const pageSize = params.variant === "profile" ? 8 : params.limit;
  const sourceItems = createMockBetHistoryItems();
  const filteredItems =
    params.variant === "game-live"
      ? sourceItems.filter((item) => item.game === params.game)
      : params.variant === "profile" && params.game
        ? sourceItems.filter((item) => item.game === params.game)
        : sourceItems;
  const visibleItems = filteredItems.slice(0, pageSize);

  return {
    items: visibleItems,
    page: params.page,
    pageSize,
    totalItems: filteredItems.length,
    totalPages: Math.max(1, Math.ceil(filteredItems.length / pageSize)),
  };
}

function createMockBetHistoryItems(): BetHistoryItem[] {
  return Array.from({ length: 16 }).map((_, index) => ({
    id: `mock-bet-${index + 1}`,
    user: {
      id: index % 2 === 0 ? "edward" : "isabella",
      name: index % 2 === 0 ? "Edward" : "Isabella",
    },
    game: index % 4 === 0 ? "roulette" : index % 4 === 1 ? "keno" : index % 4 === 2 ? "plinko" : "dice",
    betAmount: "$6,789.01",
    multiplier: 20,
    prize: "$6,789.01",
    createdAt: index % 2 === 0 ? "2026-01-13T11:15:00.000Z" : "2026-01-18T16:00:00.000Z",
  }));
}
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit fallback only if it was needed**

```bash
git add src/features/bet-history/api/bet-history-api.ts
git commit -m "chore: add temporary bet history dev fallback"
```

---

### Task 7: Profile And Games Page Integration

**Files:**
- Modify the future profile screen file that renders the user page.
- Modify the future games screen file that renders the all-games page.

- [ ] **Step 1: Integrate profile variant where the profile page is implemented**

Use this render call in the profile screen body:

```tsx
<BetHistoryTable
  className="mt-8"
  userId={userId}
  variant="profile"
/>
```

If the profile page only shows the authenticated user's own profile and the backend infers the user from cookies, omit `userId`:

```tsx
<BetHistoryTable className="mt-8" variant="profile" />
```

- [ ] **Step 2: Integrate games-live variant where the games page is implemented**

Use this render call in the games screen body:

```tsx
<BetHistoryTable className="mt-10" variant="games-live" />
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit each route integration separately**

For profile:

```bash
git add src/path/to/profile-screen.tsx
git commit -m "feat: show bet history on profile"
```

For games:

```bash
git add src/path/to/games-screen.tsx
git commit -m "feat: show live bets on games page"
```

---

## Verification Checklist

- [ ] Run `npm run lint`.
- [ ] Start `npm run dev`.
- [ ] Visit the profile page and confirm the UI matches screenshot 1: title, game tabs, search, sort, rows, pagination.
- [ ] Visit the games page and confirm the UI matches screenshot 2: `Bet Live`, live tabs, rows, `Show more`.
- [ ] Visit `/plinko` and confirm the UI matches screenshot 3: live tabs and rows under the game.
- [ ] Test at desktop width and at a narrow mobile width. The table must scroll horizontally instead of overlapping text.
- [ ] Confirm all browser-side requests go to `/api/bets/history`, not directly to the backend host.

## Self-Review Notes

- Spec coverage: the plan covers all three requested contexts and keeps Plinko-specific code limited to rendering the widget under the game.
- Placeholder scan: no unresolved placeholders remain in the reusable implementation tasks. Task 7 intentionally references future route files because those routes are not present in the current file tree.
- Type consistency: `BetHistoryVariant`, `BetHistoryLiveCategory`, `GameType`, and `BetHistoryItem` are introduced before use and reused consistently.
