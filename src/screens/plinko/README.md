# Plinko Screen

The Plinko screen is now only a route composition layer. Keep page-level layout,
fullscreen composition, live bet history placement, and store lifecycle reset here.
Do not move Plinko feature behavior back into this folder.

## Files

`ui/PlinkoScreen.tsx`

- loads Plinko config through `src/features/plinko/model/usePlinkoConfig`;
- renders feature UI blocks from `src/features/plinko/ui`;
- resets Plinko stores on unmount;
- renders the game-level `BetHistoryTable`.

## Boundaries

Plinko-specific state, controls, betting flow, sidebar wiring, board rendering,
and board animation belong in `src/features/plinko`.

`src/screens/plinko` should not own `mode`, `risk`, `rows`, `betAmount`,
`autoBetsAmount`, active rounds, or board physics.
