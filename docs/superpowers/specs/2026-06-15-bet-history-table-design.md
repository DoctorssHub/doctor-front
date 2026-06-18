# Bet History Table Design

## Goal

Build one reusable bet history table that can render in three contexts:

- A user profile page showing the selected user's betting history with game filters, search, date sorting, and pagination.
- A games page showing live bets from all games with live category tabs and a "Show more" action.
- A specific game page showing live bets for the current game with the same live category tabs and a compact layout under the game.

## Context

The project is a Next.js App Router frontend. Runtime app code lives under
`src/`, with route pages kept thin and real screens composed from
`src/screens`. User-facing behavior belongs in `src/features`, domain types in
`src/entities`, and composed reusable blocks in `src/widgets`.

The Plinko screen already lives at `src/screens/plinko/ui/PlinkoScreen.tsx`.
It currently renders the game shell and board. The bet history table should be
added below the game block without coupling its data model to Plinko-specific
round animation state.

## Recommended Approach

Create a reusable `bet-history` feature and widget:

- `src/entities/bet` owns bet history item types and formatting helpers.
- `src/features/bet-history` owns API access, response parsing, query params,
  and a React Query hook.
- `src/widgets/bet-history` owns the visual table, tabs, toolbar, pagination,
  load-more button, loading state, empty state, and error state.

The table should receive a context-oriented prop instead of being tied to one
route:

```ts
type BetHistoryVariant = "profile" | "games-live" | "game-live";
```

The route or screen decides the variant and passes the current game when needed.

## Variants

### Profile

The profile variant matches the first screenshot:

- Title: `Bets history`.
- Game tabs: `All`, `Roulette`, `Keno`, `Plinko`, `Dice`.
- Search input.
- Sort control defaulting to date.
- Pagination.
- Data scope: one user.

### Games Live

The games page variant matches the second screenshot:

- Title: `Bet Live`.
- Live tabs: `All Bets`, `High Rollers`, `Lucky Bets`.
- No search.
- No page-number pagination.
- Uses a centered `Show more` button.
- Data scope: all games and all players.

### Game Live

The specific game variant matches the third screenshot:

- No title by default.
- Live tabs: `All Bets`, `High Rollers`, `Lucky Bets`.
- No search.
- Uses a centered `Show more` button.
- Data scope: all players for the current game.

## Data Contract

The frontend should normalize backend data into this shape:

```ts
export type BetHistoryItem = {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  game: GameType;
  betAmount: string;
  multiplier: number;
  prize: string;
  createdAt: string;
};
```

The frontend can support either a single endpoint with query parameters or
separate endpoints. The preferred frontend request model is:

```txt
GET /bets/history?scope=user&game=plinko&page=1&search=&sort=date
GET /bets/history?scope=live&category=high-rollers&limit=8
GET /bets/history?scope=game&game=plinko&category=lucky-bets&limit=8
```

If the backend exposes different paths, only the API adapter should change.

## Client Boundary

The table needs tab state, search state, pagination state, and React Query, so
the widget entry component should be a client component. Route pages and broad
layouts should stay server components unless they already need client behavior.

## Styling

Use Tailwind utilities and existing color variables from `src/app/globals.css`.
The component should match the screenshots:

- Dark page/table surface.
- Alternating dark rows.
- Compact tab buttons.
- Small table type.
- Green game currency icon or fallback token mark next to bet and prize.
- Horizontal overflow on small screens instead of broken columns.
- Profile variant keeps search/sort controls above the table.
- Live variants keep the button centered below the table.

## States

The table should render:

- Skeleton rows while loading.
- Empty state text when no rows match the current filters.
- Error state with a retry button when the query fails.
- Disabled `Show more` while loading the next page.

## Verification

Implementation should run `npm run lint`. A production build is not required
unless the user asks for release-ready verification.
