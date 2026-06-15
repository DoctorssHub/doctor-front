# Plinko Board

`PlinkoBoard` is the visual board widget. It renders the canvas, buckets, and
recent multiplier history. It should not know about auth, balance, bet amount,
mode tabs, or submit behavior.

## Public Inputs

`PlinkoBoard` receives board-only props:

- `config` for payout tables and bounds used by the visual buckets;
- `risk` and `rows` for the current board shape and multipliers;
- `activeRounds` for balls currently animating;
- `recentMultipliers` for the right-side history;
- `onRoundAnimationComplete` for notifying the owner when an animation ends.

## Internal Pieces

`ui/PlinkoCanvas.tsx`

- draws pegs and active balls;
- uses canvas helpers from `lib/canvas`;
- receives `layout`, `rows`, and active rounds.

`ui/PlinkoBuckets.tsx`

- renders bucket multiplier labels;
- receives bucket layout and impact keys.

`ui/RecentMultipliers.tsx`

- renders the compact recent multiplier history;
- stays visual only.

`model/usePlinkoBoardLayout.ts`

- maps viewport width to a board layout;
- performs an initial post-mount sync so mobile reloads do not keep a stale
  desktop layout until resize.

## Boundaries

Keep betting and form state outside this widget.

Do not pass or read:

- `betAmount`;
- `autoBetsAmount`;
- `mode`;
- auth or balance state;
- submit/loading/error state.

If the board needs a new visual input, add it as an explicit prop from
`PlinkoBoardPanel`.

## Generated Data

`lib/canvas/physics-landing-table.generated.ts` is generated physics data. Do
not edit it manually unless the generation process changes.
