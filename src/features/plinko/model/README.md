# Plinko Model Stores

Plinko uses small Zustand stores instead of one broad screen-level state object.
Keep these stores separated by responsibility.

## Stores

`plinko-controls-store.ts`

- form and control values: `mode`, `risk`, `rows`, `betAmount`,
  `autoBetsAmount`, `isAutoBetsInfinite`;
- synchronous setters and control reset;
- no async betting logic.

`plinko-betting-store.ts`

- runtime submit state: `isBetting`, `isAutoBetting`,
  `isAutoBetStopRequested`, `betValidationError`;
- actions for setting/resetting submit state;
- no game board state.

`plinko-rounds-store.ts`

- board runtime state: `activeRounds`, `recentMultipliers`;
- round lifecycle actions: `addRound`, `handleRoundAnimationComplete`;
- cleanup timers and completed-round bookkeeping.

## Selector Rules

Components should subscribe only to the fields they render.

```tsx
const rows = usePlinkoControlsStore((state) => state.rows);
```

When selecting multiple fields, use `useShallow`:

```tsx
const { rows, setRows } = usePlinkoControlsStore(
  useShallow((state) => ({
    rows: state.rows,
    setRows: state.setRows,
  })),
);
```

Do not call a store hook without a selector in UI components.

## Submit Flow

Bet submission reads the current control snapshot with `getState()` inside the
submit handler. This avoids subscribing submit buttons to every input field.

```ts
const { betAmount, mode, risk, rows } = usePlinkoControlsStore.getState();
```

Use subscriptions for rendering. Use `getState()` for one-time action snapshots.

## Reset

`PlinkoScreen` resets controls, betting state, and rounds on unmount. If another
screen starts using these stores, it must define its own lifecycle reset rules.
