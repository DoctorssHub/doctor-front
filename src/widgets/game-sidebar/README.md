# Game Sidebar

`GameSidebar` is a layout shell for game control panels. It owns only the
sidebar container styling and responsive placement. It must not own game state,
betting state, validation, or game-specific controls.

## Contract

Use `GameSidebar` as a wrapper and pass controls as `children`.

```tsx
<GameSidebar>
  <PlinkoModeControl />
  <PlinkoBetAmountControl maxBet={maxBet} minBet={minBet} />
  <PlinkoRiskControl />
  <PlinkoRowsControl />
  <PlinkoAutoBetSection />
  <PlinkoBetButton />
  <PlinkoBetError />
</GameSidebar>
```

Each child should subscribe only to the state it needs. For Zustand stores, use
narrow selectors and `useShallow` when selecting multiple fields.

## Shared Controls

The `ui` folder contains reusable control primitives:

- `ModeTabs` for Manual/Auto selection.
- `BetAmountField` for stake input and amount shortcuts.
- `AutoBetControls` for finite/infinite autobet input.
- `RiskSelector` for configurable risk-like option groups.
- `RowsSlider` for numeric row-style range controls.

These components should stay controlled and stateless. They receive values and
callbacks from feature-level containers such as `PlinkoSidebar`.

## Feature Ownership

Feature screens should provide game-specific containers. For Plinko, that is
`src/screens/plinko/ui/PlinkoSidebar.tsx`.

The feature container is responsible for:

- reading game/form state from feature stores;
- composing the shared controls in the correct order;
- passing game-specific labels, options, bounds, and disabled states;
- handling submit, validation, and error display.

## Avoid

- Do not add `risk`, `rows`, `betAmount`, `mode`, or submit logic back into
  `GameSidebar`.
- Do not make `GameSidebar` a form builder driven by a generic config array.
- Do not subscribe a broad parent component to the entire game store when a
  small child can subscribe to one field.
- Do not add game-specific layout rules to the shell unless every game should
  inherit them.
