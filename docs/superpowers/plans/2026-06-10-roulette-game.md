# Roulette Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Roulette game page from the provided design screenshot, wired to the existing backend endpoints for config, user balance, and betting.

**Architecture:** Add Roulette as a focused feature under `src/features/roulette`, compose the route screen from `src/screens/roulette`, and keep `src/app/(main)/roulette/page.tsx` as a thin Server Component route. All browser-side backend calls go through the existing Next proxy at `/api`, matching the current auth API pattern.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, TanStack React Query 5, Zustand 5, Axios.

---

## Backend Contract

Use the local Next proxy for all browser calls:

```ts
const rouletteClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
```

### `GET /api/games/house/roulette/config`

Purpose: get bet limits for frontend validation.

Response:

```json
{
  "maxBet": 100000,
  "minBet": 1
}
```

### `GET /api/user/query/me`

Purpose: get authenticated user data and the current `GAME_POINTS` balance.

Relevant response shape:

```json
{
  "id": "b592fb58-f7d5-4803-b92b-148756338f7c",
  "email": "1sokolov.stas1@gmail.com",
  "username": "testgmail.com",
  "profileImgUrl": "https://storage.googleapis.com/thedoctor-dev-public/default-avatars/avatar_13.png",
  "userBalances": [
    {
      "value": "1000000",
      "balanceType": "WATCH_POINTS"
    },
    {
      "value": "100027.5",
      "balanceType": "GAME_POINTS"
    }
  ]
}
```

Only `GAME_POINTS` should be used for Roulette.

### `POST /api/games/house/roulette/bet`

Purpose: place one or more roulette bets and receive the final winning number.

Request example:

```json
{
  "params": {
    "straightValues": [
      {
        "straightNumber": 17,
        "amount": "3"
      }
    ],
    "colorValues": [
      {
        "color": "RED",
        "amount": "3"
      }
    ]
  }
}
```

Response:

```json
{
  "createdAt": "2026-06-10T09:08:59.879Z",
  "betId": "0580c504-1276-446f-9c83-da1babcb210a",
  "betSize": "3",
  "payout": "0",
  "randomPosition": 29,
  "multiplier": 0
}
```

`randomPosition` is the number where the wheel must stop. `payout` and `multiplier` determine win/loss UI. Refetch `/api/user/query/me` after a successful bet because the bet response does not include the updated balance.

---

## Design Mapping

| Screenshot area | Implementation | Data source |
| --- | --- | --- |
| Manual / Auto tabs | Implement `Manual`; render `Auto` disabled until backend contract exists | Local state |
| Chip Value | Active chip selector: `1`, `5`, `25`, `50`, `250`, `500`, `2K`, `5K`, `25K`, `50K` | Local state |
| Bet Amount | Sum of all placed chips | Derived local state |
| Clear | Remove all placed bets | Zustand action |
| Undo | Remove latest placed bet | Zustand action |
| Bet button | Submit grouped payload | `POST /api/games/house/roulette/bet` |
| Wheel | Idle/spinning/result state; stop on `randomPosition` | Bet response |
| Number grid | Straight number bets | `straightValues` |
| Red / Black | Color bets | `colorValues` |
| Even / Odd | Parity bets | `parityValues` |
| 1 to 12 / 13 to 24 / 25 to 36 | Dozen bets | `dozenValues` |
| 1 to 18 / 19 to 36 | Half bets | `halfValues` |
| 2:1 buttons | Column bets | `columnValues` |

Images will be imported later. The first implementation should use CSS-rendered chips and a CSS wheel placeholder with stable dimensions, so API and gameplay can be completed before asset replacement.

---

## File Structure

- Create: `src/app/(main)/roulette/page.tsx`
- Create: `src/screens/roulette/RouletteScreen.tsx`
- Create: `src/screens/roulette/index.ts`
- Create: `src/features/roulette/api/roulette-api.ts`
- Create: `src/features/roulette/api/roulette-types.ts`
- Create: `src/features/roulette/model/roulette-bets.ts`
- Create: `src/features/roulette/model/roulette-constants.ts`
- Create: `src/features/roulette/model/use-roulette-store.ts`
- Create: `src/features/roulette/ui/BetControls.tsx`
- Create: `src/features/roulette/ui/BettingBoard.tsx`
- Create: `src/features/roulette/ui/RouletteWheel.tsx`
- Create: `src/features/roulette/ui/RouletteResult.tsx`
- Create: `src/features/roulette/index.ts`
- Modify: `src/features/auth/api/auth-types.ts`

---

## Task 1: Type the Backend Contract

**Files:**
- Create: `src/features/roulette/api/roulette-types.ts`
- Modify: `src/features/auth/api/auth-types.ts`

- [ ] **Step 1: Add Roulette API types**

Create `src/features/roulette/api/roulette-types.ts`:

```ts
export type RouletteConfigResponse = {
  minBet: number;
  maxBet: number;
};

export type RouletteAmount = string;

export type RouletteColor = "RED" | "BLACK";
export type RouletteParity = "EVEN" | "ODD";
export type RouletteHalf = "LOW" | "HIGH";
export type RouletteDozen = "FIRST" | "SECOND" | "THIRD";
export type RouletteColumn = "TOP" | "MIDDLE" | "BOTTOM";

export type RouletteBetParams = {
  straightValues?: Array<{
    straightNumber: number;
    amount: RouletteAmount;
  }>;
  colorValues?: Array<{
    color: RouletteColor;
    amount: RouletteAmount;
  }>;
  parityValues?: Array<{
    parity: RouletteParity;
    amount: RouletteAmount;
  }>;
  halfValues?: Array<{
    half: RouletteHalf;
    amount: RouletteAmount;
  }>;
  dozenValues?: Array<{
    dozen: RouletteDozen;
    amount: RouletteAmount;
  }>;
  columnValues?: Array<{
    column: RouletteColumn;
    amount: RouletteAmount;
  }>;
  splitValues?: Array<{
    firstNumber: number;
    secondNumber: number;
    amount: RouletteAmount;
  }>;
  cornerValues?: Array<{
    firstNumber: number;
    secondNumber: number;
    thirdNumber: number;
    fourthNumber: number;
    amount: RouletteAmount;
  }>;
  streetValues?: Array<{
    street: number[];
    amount: RouletteAmount;
  }>;
  doubleStreetValues?: Array<{
    firstStreet: number[];
    secondStreet: number[];
    amount: RouletteAmount;
  }>;
};

export type RouletteBetRequest = {
  params: RouletteBetParams;
};

export type RouletteBetResponse = {
  createdAt: string;
  betId: string;
  betSize: string;
  payout: string;
  randomPosition: number;
  multiplier: number;
};
```

- [ ] **Step 2: Replace `MeResponse = unknown` with a usable type**

Modify `src/features/auth/api/auth-types.ts`:

```ts
export type UserBalanceType = "WATCH_POINTS" | "GAME_POINTS";

export type UserBalance = {
  value: string;
  balanceType: UserBalanceType;
};

export type MeResponse = {
  id: string;
  email: string;
  username: string;
  profileImgUrl: string | null;
  createdAt: string;
  isBanned: boolean;
  hasVerifiedRoleOnDiscordGuild: boolean;
  userAuthProvider: unknown[];
  userCryptoAddresses: {
    btcAddress: string | null;
    ethAddress: string | null;
    ltcAddress: string | null;
  };
  userBalances: UserBalance[];
  userDegencity: unknown | null;
  hasPassword: boolean;
  affiliateReferralsCount: number;
};
```

Keep the existing request and auth response types unchanged except replacing the current `MeResponse = unknown`.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: lint completes without TypeScript or ESLint errors from the new types.

---

## Task 2: Add Roulette API Functions

**Files:**
- Create: `src/features/roulette/api/roulette-api.ts`
- Create: `src/features/roulette/index.ts`

- [ ] **Step 1: Implement API wrapper**

Create `src/features/roulette/api/roulette-api.ts`:

```ts
import axios from "axios";
import type {
  RouletteBetRequest,
  RouletteBetResponse,
  RouletteConfigResponse,
} from "./roulette-types";

const rouletteClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export function getRouletteConfig() {
  return rouletteClient.get<RouletteConfigResponse>(
    "/games/house/roulette/config",
  );
}

export function placeRouletteBet(payload: RouletteBetRequest) {
  return rouletteClient.post<RouletteBetResponse>(
    "/games/house/roulette/bet",
    payload,
  );
}
```

- [ ] **Step 2: Add public feature exports**

Create `src/features/roulette/index.ts`:

```ts
export { getRouletteConfig, placeRouletteBet } from "./api/roulette-api";
export type {
  RouletteBetRequest,
  RouletteBetResponse,
  RouletteConfigResponse,
} from "./api/roulette-types";
```

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: imports and exports resolve cleanly.

---

## Task 3: Add Roulette Bet Model

**Files:**
- Create: `src/features/roulette/model/roulette-constants.ts`
- Create: `src/features/roulette/model/roulette-bets.ts`

- [ ] **Step 1: Add constants**

Create `src/features/roulette/model/roulette-constants.ts`:

```ts
export const ROULETTE_CHIP_VALUES = [1, 5, 25, 50, 250, 500, 2000, 5000, 25000, 50000] as const;

export const ROULETTE_RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export const ROULETTE_BOARD_ROWS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
] as const;
```

- [ ] **Step 2: Add bet model and payload builder**

Create `src/features/roulette/model/roulette-bets.ts`:

```ts
import type {
  RouletteBetParams,
  RouletteBetRequest,
  RouletteColor,
  RouletteColumn,
  RouletteDozen,
  RouletteHalf,
  RouletteParity,
} from "../api/roulette-types";

export type PlacedRouletteBet =
  | {
      id: string;
      kind: "straight";
      straightNumber: number;
      amount: number;
    }
  | {
      id: string;
      kind: "color";
      color: RouletteColor;
      amount: number;
    }
  | {
      id: string;
      kind: "parity";
      parity: RouletteParity;
      amount: number;
    }
  | {
      id: string;
      kind: "half";
      half: RouletteHalf;
      amount: number;
    }
  | {
      id: string;
      kind: "dozen";
      dozen: RouletteDozen;
      amount: number;
    }
  | {
      id: string;
      kind: "column";
      column: RouletteColumn;
      amount: number;
    };

export function getPlacedBetsTotal(bets: PlacedRouletteBet[]) {
  return bets.reduce((total, bet) => total + bet.amount, 0);
}

export function formatRouletteAmount(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

export function buildRouletteBetPayload(
  bets: PlacedRouletteBet[],
): RouletteBetRequest {
  const params: RouletteBetParams = {};

  for (const bet of bets) {
    const amount = formatRouletteAmount(bet.amount);

    if (bet.kind === "straight") {
      params.straightValues = [
        ...(params.straightValues ?? []),
        { straightNumber: bet.straightNumber, amount },
      ];
    }

    if (bet.kind === "color") {
      params.colorValues = [
        ...(params.colorValues ?? []),
        { color: bet.color, amount },
      ];
    }

    if (bet.kind === "parity") {
      params.parityValues = [
        ...(params.parityValues ?? []),
        { parity: bet.parity, amount },
      ];
    }

    if (bet.kind === "half") {
      params.halfValues = [
        ...(params.halfValues ?? []),
        { half: bet.half, amount },
      ];
    }

    if (bet.kind === "dozen") {
      params.dozenValues = [
        ...(params.dozenValues ?? []),
        { dozen: bet.dozen, amount },
      ];
    }

    if (bet.kind === "column") {
      params.columnValues = [
        ...(params.columnValues ?? []),
        { column: bet.column, amount },
      ];
    }
  }

  return { params };
}
```

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: no unused types or unreachable branches.

---

## Task 4: Add Zustand Game Store

**Files:**
- Create: `src/features/roulette/model/use-roulette-store.ts`

- [ ] **Step 1: Implement store**

Create `src/features/roulette/model/use-roulette-store.ts`:

```ts
import { create } from "zustand";
import type { RouletteBetResponse } from "../api/roulette-types";
import type { PlacedRouletteBet } from "./roulette-bets";

type RouletteResult = {
  betId: string;
  number: number;
  betSize: string;
  payout: string;
  multiplier: number;
  createdAt: string;
};

type RouletteStore = {
  selectedChip: number;
  placedBets: PlacedRouletteBet[];
  isSpinning: boolean;
  result: RouletteResult | null;
  selectChip: (chip: number) => void;
  placeBet: (bet: Omit<PlacedRouletteBet, "id" | "amount">) => void;
  clearBets: () => void;
  undoBet: () => void;
  startSpin: () => void;
  finishSpin: (response: RouletteBetResponse) => void;
  resetResult: () => void;
};

function createBetId() {
  return `roulette-bet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useRouletteStore = create<RouletteStore>()((set, get) => ({
  selectedChip: 1,
  placedBets: [],
  isSpinning: false,
  result: null,
  selectChip: (chip) => {
    set({ selectedChip: chip });
  },
  placeBet: (bet) => {
    const { selectedChip } = get();

    set((state) => ({
      placedBets: [
        ...state.placedBets,
        {
          ...bet,
          id: createBetId(),
          amount: selectedChip,
        } as PlacedRouletteBet,
      ],
      result: null,
    }));
  },
  clearBets: () => {
    set({ placedBets: [], result: null });
  },
  undoBet: () => {
    set((state) => ({
      placedBets: state.placedBets.slice(0, -1),
    }));
  },
  startSpin: () => {
    set({ isSpinning: true, result: null });
  },
  finishSpin: (response) => {
    set({
      isSpinning: false,
      result: {
        betId: response.betId,
        number: response.randomPosition,
        betSize: response.betSize,
        payout: response.payout,
        multiplier: response.multiplier,
        createdAt: response.createdAt,
      },
      placedBets: [],
    });
  },
  resetResult: () => {
    set({ result: null });
  },
}));
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: store compiles. If TypeScript rejects the union cast in `placeBet`, replace the broad `placeBet` action with one action per bet kind.

---

## Task 5: Build UI Components

**Files:**
- Create: `src/features/roulette/ui/BetControls.tsx`
- Create: `src/features/roulette/ui/BettingBoard.tsx`
- Create: `src/features/roulette/ui/RouletteWheel.tsx`
- Create: `src/features/roulette/ui/RouletteResult.tsx`

- [ ] **Step 1: Implement `BetControls`**

Responsibilities:

- render Manual and disabled Auto tabs;
- render chip selector;
- show current selected chip and total bet amount;
- render Clear, Undo, Bet buttons;
- disable Bet when no bets, spinning, under `minBet`, over `maxBet`, or over `GAME_POINTS`.

Props:

```ts
type BetControlsProps = {
  selectedChip: number;
  totalBetAmount: number;
  gameBalance: number;
  minBet: number;
  maxBet: number;
  isSpinning: boolean;
  canUndo: boolean;
  onSelectChip: (chip: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onSubmit: () => void;
};
```

- [ ] **Step 2: Implement `BettingBoard`**

Responsibilities:

- render green `0`;
- render three rows using `ROULETTE_BOARD_ROWS`;
- color numbers using `ROULETTE_RED_NUMBERS`;
- render `2:1`, dozens, halves, even/odd, red/black buttons;
- call `onPlaceBet` with backend-aligned bet kinds.

Props:

```ts
import type { PlacedRouletteBet } from "../model/roulette-bets";

type BettingBoardProps = {
  disabled: boolean;
  onPlaceBet: (bet: Omit<PlacedRouletteBet, "id" | "amount">) => void;
};
```

- [ ] **Step 3: Implement `RouletteWheel`**

Responsibilities:

- render a stable placeholder wheel with numbers around a circle;
- support `isSpinning`;
- visually highlight `resultNumber` after spin;
- keep dimensions stable so future image assets can replace the placeholder.

Props:

```ts
type RouletteWheelProps = {
  isSpinning: boolean;
  resultNumber: number | null;
};
```

- [ ] **Step 4: Implement `RouletteResult`**

Responsibilities:

- show result only after a completed bet;
- show number, bet size, payout, multiplier;
- treat `Number(payout) > 0 || multiplier > 0` as win.

Props:

```ts
type RouletteResultProps = {
  result: {
    number: number;
    betSize: string;
    payout: string;
    multiplier: number;
  } | null;
};
```

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected: all UI props and imports resolve.

---

## Task 6: Compose `RouletteScreen`

**Files:**
- Create: `src/screens/roulette/RouletteScreen.tsx`
- Create: `src/screens/roulette/index.ts`

- [ ] **Step 1: Implement helper to extract `GAME_POINTS`**

Use this inside `RouletteScreen.tsx`:

```ts
import type { MeResponse } from "@/features/auth/api/auth-types";

function getGamePointsBalance(user: MeResponse | undefined) {
  const balance = user?.userBalances.find(
    (item) => item.balanceType === "GAME_POINTS",
  );

  return Number(balance?.value ?? 0);
}
```

- [ ] **Step 2: Implement screen data flow**

`RouletteScreen.tsx` must be a Client Component because it uses Zustand, React Query, and button handlers:

```tsx
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
  getRouletteConfig,
  placeRouletteBet,
} from "@/features/roulette";
import { BetControls } from "@/features/roulette/ui/BetControls";
import { BettingBoard } from "@/features/roulette/ui/BettingBoard";
import { RouletteResult } from "@/features/roulette/ui/RouletteResult";
import { RouletteWheel } from "@/features/roulette/ui/RouletteWheel";
import {
  buildRouletteBetPayload,
  getPlacedBetsTotal,
} from "@/features/roulette/model/roulette-bets";
import { useRouletteStore } from "@/features/roulette/model/use-roulette-store";
import type { MeResponse } from "@/features/auth/api/auth-types";

function getGamePointsBalance(user: MeResponse | undefined) {
  const balance = user?.userBalances.find(
    (item) => item.balanceType === "GAME_POINTS",
  );

  return Number(balance?.value ?? 0);
}

export function RouletteScreen() {
  const queryClient = useQueryClient();
  const selectedChip = useRouletteStore((state) => state.selectedChip);
  const placedBets = useRouletteStore((state) => state.placedBets);
  const isSpinning = useRouletteStore((state) => state.isSpinning);
  const result = useRouletteStore((state) => state.result);
  const selectChip = useRouletteStore((state) => state.selectChip);
  const placeBet = useRouletteStore((state) => state.placeBet);
  const clearBets = useRouletteStore((state) => state.clearBets);
  const undoBet = useRouletteStore((state) => state.undoBet);
  const startSpin = useRouletteStore((state) => state.startSpin);
  const finishSpin = useRouletteStore((state) => state.finishSpin);

  const configQuery = useQuery({
    queryKey: ["roulette", "config"],
    queryFn: async () => (await getRouletteConfig()).data,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await getCurrentUser()).data,
  });

  const betMutation = useMutation({
    mutationFn: async () => {
      const payload = buildRouletteBetPayload(placedBets);

      return (await placeRouletteBet(payload)).data;
    },
    onMutate: () => {
      startSpin();
    },
    onSuccess: async (response) => {
      finishSpin(response);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const totalBetAmount = getPlacedBetsTotal(placedBets);
  const gameBalance = getGamePointsBalance(meQuery.data);
  const minBet = configQuery.data?.minBet ?? 1;
  const maxBet = configQuery.data?.maxBet ?? 100000;

  return (
    <main className="min-h-screen bg-[#080d18] px-4 py-6 text-white">
      <div className="mx-auto grid max-w-[1280px] gap-0 overflow-hidden rounded-lg border border-white/10 bg-[#0a0f1b] lg:grid-cols-[302px_1fr]">
        <BetControls
          selectedChip={selectedChip}
          totalBetAmount={totalBetAmount}
          gameBalance={gameBalance}
          minBet={minBet}
          maxBet={maxBet}
          isSpinning={isSpinning || betMutation.isPending}
          canUndo={placedBets.length > 0}
          onSelectChip={selectChip}
          onClear={clearBets}
          onUndo={undoBet}
          onSubmit={() => betMutation.mutate()}
        />

        <section className="flex min-w-0 flex-col gap-8 bg-[#07131d] p-4 md:p-6">
          <RouletteWheel
            isSpinning={isSpinning || betMutation.isPending}
            resultNumber={result?.number ?? null}
          />

          <BettingBoard
            disabled={isSpinning || betMutation.isPending}
            onPlaceBet={placeBet}
          />

          <RouletteResult result={result} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Export screen**

Create `src/screens/roulette/index.ts`:

```ts
export { RouletteScreen } from "./RouletteScreen";
```

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: screen compiles. If `getCurrentUser()` returns `unknown`, complete Task 1's `MeResponse` replacement first.

---

## Task 7: Add the Route

**Files:**
- Create: `src/app/(main)/roulette/page.tsx`

- [ ] **Step 1: Add thin App Router page**

Create `src/app/(main)/roulette/page.tsx`:

```tsx
import { RouletteScreen } from "@/screens/roulette";

export default function RoulettePage() {
  return <RouletteScreen />;
}
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: the route imports the screen correctly.

---

## Task 8: Manual QA and Responsive Pass

**Files:**
- Modify UI component files from Task 5 as needed.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev
```

Expected: Next dev server starts and serves `/roulette`.

- [ ] **Step 2: Open `/roulette` and test desktop**

Check at desktop width:

- left controls match the screenshot structure;
- wheel is centered in the right panel;
- board rows match the screenshot number layout;
- `Bet` is disabled with zero placed bets;
- clicking chips changes selected chip;
- clicking a board item increases `Bet Amount`;
- `Undo` removes the last chip;
- `Clear` removes all chips.

- [ ] **Step 3: Test backend flow**

With an authenticated user and `BACKEND_API_URL` configured:

- `/api/games/house/roulette/config` returns `minBet` and `maxBet`;
- `/api/user/query/me` returns `GAME_POINTS`;
- a valid bet calls `/api/games/house/roulette/bet`;
- wheel result uses `randomPosition`;
- win/loss uses `payout` and `multiplier`;
- balance refetches after success.

- [ ] **Step 4: Test responsive widths**

Check:

- `1440px`: should stay close to screenshot layout.
- `1024px`: controls and board remain readable.
- `768px`: layout can stack, no overlap.
- `375px`: board scrolls or compresses without text overflow.

- [ ] **Step 5: Final lint**

Run:

```bash
npm run lint
```

Expected: lint passes.

---

## Asset Replacement Phase

When images are ready, replace only visual internals without changing API/state contracts:

- roulette wheel artwork in `src/features/roulette/ui/RouletteWheel.tsx`;
- chip artwork in `src/features/roulette/ui/BetControls.tsx`;
- optional background/media assets under `src/assets/roulette/`;
- keep `randomPosition` as the single source of truth for the final wheel result.

