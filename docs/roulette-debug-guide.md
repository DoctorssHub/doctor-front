# Roulette Debug Guide

This document explains the roulette feature structure and the best places to
start debugging. The feature lives in `src/features/roulette`; the route and
screen layers only connect it to the App Router.

## File Structure

```text
src/
  app/
    (main)/
      roulette/
        page.tsx
  screens/
    roulette/
      index.ts
      RouletteScreen.tsx
  features/
    roulette/
      index.ts
      api/
        roulette-api.ts
        roulette-types.ts
      lib/
        roulette-balance.ts
        roulette-errors.ts
        roulette-formatters.ts
      model/
        roulette-bets.ts
        roulette-constants.ts
        use-auto-roulette-betting.ts
        use-roulette-game.ts
        use-roulette-store.ts
      ui/
        index.ts
        bet-controls/
          AutoBetSettings.tsx
          BetControls.tsx
          BetModeSwitch.tsx
          BetSubmitPanel.tsx
          chip-assets.ts
          ChipPicker.tsx
          index.ts
          ManualBetActions.tsx
        betting-board/
          betting-board-constants.ts
          betting-board-types.ts
          betting-board-utils.ts
          BettingBoard.tsx
          BettingNumberGrid.tsx
          BettingOutsideBets.tsx
          index.ts
          PlacedChip.tsx
          mobile-betting-board/
            index.ts
            mobile-betting-board-constants.ts
            mobile-betting-board-utils.ts
            MobileBetButton.tsx
            MobileBettingBoard.tsx
        game-panel/
          index.ts
          RouletteGamePanel.tsx
        history/
          index.ts
          RouletteHistory.tsx
        result/
          index.ts
          RouletteResult.tsx
        roulette-wheel/
          index.ts
          roulette-wheel-constants.ts
          roulette-wheel-utils.ts
          RouletteBall.tsx
          RouletteWheel.tsx
          RouletteWheelCenter.tsx
          RouletteWheelImageLayer.tsx
          RouletteWheelShell.tsx
          useRouletteWheelAnimation.ts
        win-modal/
          index.ts
          RouletteWinModal.tsx
```

High-level ownership:

- `app` and `screens` connect the route to the roulette feature.
- `api` contains backend request functions and API types.
- `model` contains local state, domain types, payload builders, constants, and
  runtime orchestration hooks.
- `lib` contains pure helpers that are reusable inside the feature.
- `ui` contains presentational and composed UI blocks, grouped by user-facing
  area.

## Quick Runtime Map

1. `src/app/(main)/roulette/page.tsx` renders `RouletteScreen`.
2. `src/screens/roulette/RouletteScreen.tsx` calls `useRouletteGame()` and
   passes the returned props into two main blocks:
   - `BetControls` - the left betting controls panel.
   - `RouletteGamePanel` - the wheel, history, betting board, and win modal.
3. `src/features/roulette/model/use-roulette-game.ts` coordinates the runtime:
   React Query, Zustand state, submit mutation, auto-bet, and animation flags.
4. `src/features/roulette/model/use-roulette-store.ts` stores local state:
   selected chip, placed bets, result, history, and spin state.
5. `src/features/roulette/api/roulette-api.ts` talks to the backend through the
   local Next proxy at `/api`.

If the issue crosses API, local state, and UI, start with
`use-roulette-game.ts`. It is the orchestration point.

## Route And Screen Layer

### `src/app/(main)/roulette/page.tsx`

Thin Next.js route. It should not contain business logic. If the page does not
load, check:

- `RouletteScreen` export from `src/screens/roulette`;
- the `(main)` route group/layout;
- client-side errors below the screen layer.

### `src/screens/roulette/RouletteScreen.tsx`

Client screen that assembles the feature:

- calls `useRouletteGame`;
- renders the page shell;
- passes `betControlsProps` to `BetControls`;
- passes `gamePanelProps` to `RouletteGamePanel`.

Debug layout between the controls panel and game panel here. Do not add betting
or API logic to this file.

## Public Exports

### `src/features/roulette/index.ts`

Public feature entrypoint for roulette API functions and types. Use this only
when code outside the roulette feature needs the stable public API.

### `src/features/roulette/ui/index.ts`

Public UI entrypoint. It currently exports:

- `BetControls`;
- `RouletteGamePanel`.

Keep internal UI components imported locally inside the roulette feature unless
there is a real cross-feature use case.

## API Layer

### `src/features/roulette/api/roulette-api.ts`

Creates the Axios client:

- `baseURL: "/api"`;
- `withCredentials: true`.

Methods:

- `getRouletteConfig()` -> `GET /games/house/roulette/config`;
- `placeRouletteBet(payload)` -> `POST /games/house/roulette/bet`.

Browser-side backend calls must go through `/api`, not directly to the backend
host. For 401, 500, CORS, or cookie issues, also inspect
`src/app/api/[...path]/route.ts` and `BACKEND_API_URL`.

### `src/features/roulette/api/roulette-types.ts`

Defines the roulette API contract:

- `RouletteConfigResponse` - `minBet`, `maxBet`;
- `RouletteBetRequest` - `params`;
- `RouletteBetResponse` - `betId`, `betSize`, `payout`, `randomPosition`,
  `multiplier`, `createdAt`;
- value types for color, parity, half, dozen, and column bets.

The API types already include `splitValues`, `cornerValues`, `streetValues`,
and `doubleStreetValues`, but the current UI/model layer does not create those
bet types. If the backend starts requiring them, update `NewRouletteBet`, the
desktop/mobile board UI, and `buildRouletteBetPayload`.

## Model Layer

### `src/features/roulette/model/use-roulette-game.ts`

Main orchestrator. It owns:

- config loading through query key `["roulette", "config"]`;
- current user loading through query key `["me"]`;
- bet submit mutation;
- spin start/finish coordination;
- local GAME_POINTS balance update after a backend response;
- win modal lifecycle;
- auto-bet lifecycle;
- props for `BetControls` and `RouletteGamePanel`.

Important debug points:

- `configQuery.data?.minBet/maxBet` - when the Bet button is disabled by limits;
- `meQuery.data` and `getGamePointsBalance` - when balance is wrong;
- `betMutation.onMutate` - starts the spin before the backend response returns;
- `betMutation.onSuccess` - applies result, balance update, and auto-bet schedule;
- `betMutation.onError` - stops auto-bet and resets spin/animation state;
- `handleLandingComplete` - adds result history and opens the win modal.

Commonly confused flags:

- `isSpinning` - store state for an active spin;
- `betMutation.isPending` - request is still in flight;
- `isResultAnimating` - backend responded, but the ball is still landing;
- `isAutoRunning` - auto-bet loop is active.

### `src/features/roulette/model/use-roulette-store.ts`

Zustand store for local roulette state.

State:

- `selectedChip` - currently selected chip value;
- `placedBets` - local list of placed bets;
- `isSpinning` - active spin flag;
- `result` - latest backend result;
- `resultHistory` - latest results shown in the UI.

Actions:

- `selectChip(chip)` - changes the selected chip;
- `placeBet(bet)` - adds a bet with `amount = selectedChip`;
- `clearBets()` - clears bets and result;
- `undoBet()` - removes the last placed bet;
- `startSpin()` - sets `isSpinning: true` and clears result;
- `finishSpin(response, options)` - maps backend response into local result;
- `addResultToHistory()` - adds result to history, deduped by `betId`;
- `stopSpin()` - emergency spin reset;
- `resetResult()` - clears result;
- `settleResultHistory()` - keeps the last 5 results after exit animation.

If chips on the board show incorrect amounts, start with `placeBet`,
`buildBetAmountMap`, and `PlacedChip`.

### `src/features/roulette/model/roulette-bets.ts`

Defines local bet types and builds the backend payload.

Currently supported bet kinds:

- `straight`;
- `color`;
- `parity`;
- `half`;
- `dozen`;
- `column`.

Key functions:

- `getPlacedBetsTotal(bets)` - sums all local bet amounts;
- `formatRouletteAmount(amount)` - number to API string;
- `buildRouletteBetPayload(bets)` - groups local bets into API `params`.

If the backend receives the wrong payload, inspect `handleBetSubmit` and
`buildRouletteBetPayload`.

### `src/features/roulette/model/use-auto-roulette-betting.ts`

Auto-bet state machine. It keeps refs for payload, remaining count, timeout,
and running state.

Important details:

- `AUTO_NEXT_SPIN_DELAY_MS = 6200`;
- `startAutoBetting(payload)` stores the payload and returns mutation variables;
- `scheduleNextAutoBet(callback)` runs after a successful bet response;
- `stopAutoBetting()` clears refs, timeout, and UI running state;
- `handleAutoBetCountChange` allows digits only.

If auto-bet does not stop or places extra bets, check:

- whether `stopAutoBetting` runs on error;
- whether `autoRemainingRef.current` decrements correctly;
- whether `isAutoInfinite` is still true;
- whether timeout cleanup runs on stop.

### `src/features/roulette/model/roulette-constants.ts`

Core roulette constants:

- `ROULETTE_CHIP_VALUES` - selectable chip values;
- `ROULETTE_RED_NUMBERS` - red wheel/board numbers;
- `ROULETTE_BOARD_ROWS` - betting board number layout;
- `ROULETTE_WHEEL_ORDER` - wheel pocket order.

If the ball lands on the wrong number, check `ROULETTE_WHEEL_ORDER` and
`roulette-wheel-utils.ts`.

## Lib Layer

### `src/features/roulette/lib/roulette-balance.ts`

Handles GAME_POINTS balance helpers.

- `getGamePointsBalance(user)` finds `balanceType === "GAME_POINTS"`.
- `applyRouletteBalanceResult(user, response)` updates local balance as
  `current - betSize + payout`.

If balance is wrong after a bet, compare:

- `response.betSize`;
- `response.payout`;
- `user.userBalances`;
- whether backend numeric strings parse correctly with `Number`.

### `src/features/roulette/lib/roulette-errors.ts`

Thin error mapper:

- returns `error.message` for `Error` instances;
- otherwise returns `"Bet request failed"`.

Add Axios/backend-specific error mapping here instead of inside UI components.

### `src/features/roulette/lib/roulette-formatters.ts`

`formatCoinAmount(value)` formats numbers with `Intl.NumberFormat("en-US")`
and up to two decimal digits. Used for chip amount, total bet, and min/max
helper text.

## Bet Controls UI

Folder: `src/features/roulette/ui/bet-controls`.

### `BetControls.tsx`

Main left-panel container. It does not own state; it derives UI state from props:

- `isLoading = isSpinning || isSubmitting || isAnimating`;
- `controlsDisabled = isAutoRunning || isLoading`;
- `isBetInvalid` - min, max, and balance validation;
- `isAutoBetCountInvalid`;
- `helperMessage`;
- `actionLabel`.

If the Bet button is disabled unexpectedly, check these derived values first.

### `ChipPicker.tsx`

Owns:

- chip list from `ROULETTE_CHIP_VALUES`;
- selected chip visual state;
- total bet amount display;
- selected chip amount display.

Selected border behavior:

- outer `border-2` lives on the button;
- `p-[5px]` creates the gap between border and chip image;
- selected state uses `border-[var(--color-brand)]`;
- unselected state uses `border-transparent`.

If the border is invisible, check `--color-brand` and make sure
`border-transparent` is not active for the selected state.

### `chip-assets.ts`

Maps chip value to image asset. If a chip image or fallback label is wrong,
check this map and the corresponding asset import.

### `BetModeSwitch.tsx`

Switches manual/auto mode. If auto controls do not appear, check `mode`,
`onModeChange`, and the disabled state from `BetControls`.

### `ManualBetActions.tsx`

Clear/Undo actions for manual mode. Buttons are disabled when there are no bets
or the game is locked.

### `AutoBetSettings.tsx`

Auto-bet count input and infinite toggle. Count sanitization lives in
`use-auto-roulette-betting.ts`, not here.

### `BetSubmitPanel.tsx`

Presentational submit button and helper/error text. If the message is wrong,
check `helperMessage` in `BetControls`.

## Game Panel UI

Folder: `src/features/roulette/ui/game-panel`.

### `RouletteGamePanel.tsx`

Main right-side game area. It assembles:

- `RouletteHistory`;
- `RouletteWheel`;
- `BettingBoard`;
- `RouletteWinModal`.

Visibility logic:

- `winResult` exists only when result exists, modal is visible, result animation
  is finished, and payout is greater than 0;
- on mobile, the wheel becomes a fixed overlay during spin/result animation.

If the win modal does not appear, check `isResultAnimating`,
`isWinModalVisible`, `result.payout`, and `handleLandingComplete`.

## Betting Board UI

Folder: `src/features/roulette/ui/betting-board`.

### `BettingBoard.tsx`

Container for desktop/tablet board and mobile board.

Owns:

- `hoverArea` state;
- `buildBetAmountMap(placedBets)`;
- hover/focus handlers;
- passing `onPlaceBet` down to board parts.

Desktop board is hidden on `max-tablet`; mobile board is shown on `max-tablet`.

### `BettingNumberGrid.tsx`

Desktop/tablet number grid:

- zero cell;
- 3 number rows from `ROULETTE_BOARD_ROWS`;
- column bets `2:1`;
- straight bet clicks;
- column bet clicks;
- `PlacedChip` over a cell when it has an amount.

If a number has the wrong color, check `getNumberBackgroundClass` and
`ROULETTE_RED_NUMBERS`.

### `BettingOutsideBets.tsx`

Desktop/tablet outside bets:

- dozens: `1 to 12`, `13 to 24`, `25 to 36`;
- halves: `1 to 18`, `19 to 36`;
- parity: Even/Odd;
- color: Red/Black;
- tablet-only Clear/Undo icons.

### `mobile-betting-board/MobileBettingBoard.tsx`

Mobile-specific board layout. It supports the same bet kinds with a different
layout:

- left column: half, parity, color, clear;
- middle column: dozens and undo;
- right column: zero, numbers, columns.

If desktop works but mobile does not, compare click handlers here with
`BettingNumberGrid` and `BettingOutsideBets`.

### `PlacedChip.tsx`

Displays the placed amount on a board cell. If the amount exists in the store
but is not visible on the board, check `buildBetAmountMap`, key format, and this
component.

### `betting-board-utils.ts`

Shared board helpers:

- cell class builders;
- `getBetKey`;
- `getStraightBetAmount`;
- `buildBetAmountMap`;
- `isNumberInHoverArea`.

This is the first place to debug hover highlight, dimming, and bet aggregation.

### `betting-board-types.ts`

Hover area and handler types. If you add a new bet type with highlight behavior,
extend these types first.

### `betting-board-constants.ts`

Board constants, including column bet mapping.

## Roulette Wheel UI

Folder: `src/features/roulette/ui/roulette-wheel`.

### `RouletteWheel.tsx`

Container that connects the animation hook and passes refs into:

- `RouletteWheelShell`;
- `RouletteWheelImageLayer`;
- `RouletteWheelCenter`;
- `RouletteBall`.

### `useRouletteWheelAnimation.ts`

Imperative wheel and ball animation using `requestAnimationFrame`.

Main refs:

- `wheelRef` - outer wheel;
- `centerRef` - center layer rotating in the opposite direction;
- `ballRef` - ball;
- `wheelAngleRef`, `centerAngleRef`, `ballAngleRef`, `ballRadiusRef`;
- `isLandingRef`, `isSettledRef`.

Flows:

- idle loop always rotates wheel/center;
- when `isSpinning` is true, the ball enters fast mode;
- when `isSpinning` becomes false and `resultNumber` exists, landing starts;
- after landing, `onLandingComplete` is called.

If result exists but history/modal do not update, check whether
`onLandingComplete` fired.

### `roulette-wheel-utils.ts`

Landing math:

- `getResultCellAngle(resultNumber)`;
- `getResultAngle`;
- `getCurrentResultAngle`;
- `getLandingDelta`;
- `getLandingRadius`;
- `getBallTransform`.

If the ball lands in the wrong pocket, check:

- `ROULETTE_WHEEL_ORDER`;
- `POCKET_CENTER_OFFSET`;
- `WHEEL_SPEED`;
- `LANDING_DURATION_MS`;
- whether backend `randomPosition` is a number from 0 to 36.

### `roulette-wheel-constants.ts`

Animation constants: speeds, radii, durations, hold/exit timing. Change them
carefully because they affect landing and the timing of `onLandingComplete`.

### `RouletteWheelShell.tsx`, `RouletteWheelImageLayer.tsx`,
`RouletteWheelCenter.tsx`, `RouletteBall.tsx`

Presentational wheel pieces. Use these for asset/layering issues. Use the
hook/utils/constants for landing math issues.

## History, Result, And Win Modal

### `src/features/roulette/ui/history/RouletteHistory.tsx`

Displays `resultHistory`. The store keeps up to 6 entries, then
`settleResultHistory` keeps the last 5 after exit animation.

If history duplicates entries, check `addResultToHistory` in the store. It
dedupes by `betId`.

### `src/features/roulette/ui/result/RouletteResult.tsx`

Presentational result view. If result values are wrong, the source is
`finishSpin(response)`, not this component.

### `src/features/roulette/ui/win-modal/RouletteWinModal.tsx`

Displays the win modal. Visibility is decided in `RouletteGamePanel`; lifecycle
is controlled in `useRouletteGame`.

## Common Debug Scenarios

### Bet Button Is Disabled

Check in this order:

1. `BetControls.tsx`: `isLoading`, `isBetInvalid`, `isAutoBetCountInvalid`.
2. `use-roulette-game.ts`: `minBet`, `maxBet`, `gameBalance`,
   `totalBetAmount`.
3. `configQuery` and `meQuery`: whether config/user loaded.
4. `placedBets`: whether any bets exist.

### Bet Is Not Submitted

1. `handleBetSubmit` in `use-roulette-game.ts`.
2. `buildRouletteBetPayload` in `roulette-bets.ts`.
3. `placeRouletteBet` in `roulette-api.ts`.
4. Network request to `/api/games/house/roulette/bet`.
5. Proxy route `src/app/api/[...path]/route.ts` and `BACKEND_API_URL`.

### Backend Receives Wrong Payload

1. Check the `NewRouletteBet` kind coming from the board.
2. Check `placeBet` in the store: amount comes from `selectedChip`.
3. Check `buildRouletteBetPayload`: each kind must go into the correct params
   array.
4. Remember that split/corner/street/double-street exist in API types but are
   not currently created by the UI.

### Balance Is Wrong After Bet

1. Network response: `betSize`, `payout`.
2. `applyRouletteBalanceResult`: formula is `current - betSize + payout`.
3. Query cache `["me"]` after `queryClient.setQueryData`.
4. Whether backend returns numeric strings that parse correctly with `Number`.

### Wheel Spins But Result Never Settles

1. `betMutation.onSuccess` should call `finishSpin`.
2. `isSpinning` should become false.
3. `RouletteWheel` should receive `resultNumber`.
4. `useRouletteWheelAnimation` should finish landing and call
   `onLandingComplete`.
5. `handleLandingComplete` should add history and clear `isResultAnimating`.

### Win Modal Does Not Show

1. `result.payout` must be greater than 0.
2. `handleLandingComplete` must run.
3. `isResultAnimating` must be false.
4. `isWinModalVisible` must be true.
5. Pointerdown or the 2000ms timeout can close the modal quickly.

### Board Chips Do Not Match Bet Amounts

1. `placedBets` in the store.
2. `getBetKey` in `betting-board-utils.ts`.
3. `buildBetAmountMap`.
4. `PlacedChip` in the relevant cell.
5. For mobile, also check `MobileBettingBoard.tsx`.

### Hover Highlight Is Wrong

1. `hoverArea` in `BettingBoard.tsx`.
2. `onGetHoverHandlers`.
3. `isNumberInHoverArea`.
4. Desktop: `BettingNumberGrid` / `BettingOutsideBets`.
5. Mobile: `MobileBettingBoard`.

### Selected Chip Border Is Invisible Or Wrong Size

1. `ChipPicker.tsx`.
2. Selected class: `border-[var(--color-brand)]`.
3. Unselected class: `border-transparent`.
4. `p-[5px]` controls the gap between the outer border and chip image.
5. CSS variable `--color-brand` in global tokens.

## Where To Add New Behavior

- New backend endpoint or contract change:
  `api/roulette-types.ts`, `api/roulette-api.ts`.
- New bet type:
  `model/roulette-bets.ts`, `api/roulette-types.ts`, board UI, mobile board UI,
  `betting-board-utils.ts`.
- New chip value:
  `model/roulette-constants.ts` and, if needed, `ui/bet-controls/chip-assets.ts`.
- Validation change for min, max, or balance:
  `BetControls.tsx` and/or `use-roulette-game.ts`.
- Auto-bet logic change:
  `model/use-auto-roulette-betting.ts`.
- Wheel animation change:
  `ui/roulette-wheel/useRouletteWheelAnimation.ts`,
  `roulette-wheel-utils.ts`, `roulette-wheel-constants.ts`.
- Betting board layout change:
  the relevant file under `ui/betting-board`.
- Responsive/mobile board change:
  `ui/betting-board/mobile-betting-board`.


