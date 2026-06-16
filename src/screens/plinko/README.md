# Plinko Screen

The Plinko screen is a composition layer. Keep route-level layout, config
loading, and store lifecycle here. Do not move form state back into
`PlinkoScreen`.

## Components

`ui/PlinkoScreen.tsx`

- loads Plinko config with `usePlinkoConfig`;
- renders the sidebar and board panel;
- resets Plinko stores on unmount.

`ui/PlinkoSidebar.tsx`

- composes game controls inside `GameSidebar`;
- splits controls into small selector components;
- owns Plinko-specific sidebar wiring, labels, disabled states, submit button,
  and errors.

`ui/PlinkoBoardPanel.tsx`

- subscribes to `risk`, `rows`, `activeRounds`, and `recentMultipliers`;
- passes board-only props into `PlinkoBoard`.

## State Boundary

Use feature stores from `src/features/plinko/model` for Plinko state.

- Controls store: form/control values.
- Betting store: submit/autobet/error runtime state.
- Rounds store: active board rounds and recent multipliers.

`PlinkoScreen` should not own `mode`, `risk`, `rows`, `betAmount`,
`autoBetsAmount`, or round arrays with local `useState`.

## Render Boundary

Keep subscriptions close to the UI that renders them. For example, rows should
be read in `PlinkoRowsControl` and `PlinkoBoardPanel`, not in `PlinkoScreen`.

This keeps changing the stake input from re-rendering unrelated board or rows
controls.

## Config

`usePlinkoConfig` memoizes parsed config so board props stay referentially
stable when unrelated controls change.
