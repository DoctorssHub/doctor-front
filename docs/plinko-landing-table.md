# Plinko Landing Table

This document explains the precomputed landing table that drives the Plinko
ball animation, when it goes stale, and how to regenerate and verify it. There
is intentionally **no committed generator script** — this file is the
reproducible recipe instead.

## Why the table exists

The backend decides which bucket a round lands in. The ball animation must land
in **exactly** that bucket, visibly and honestly. On the normal path the ball
lands in the target bucket **on its own**, with no correction. A safety
correction does exist, but it only ever runs for a stale or incomplete table —
never on the normal path — and even then it keeps the shown bucket equal to the
payout (see the runtime safety guard below).

The catch: live deterministic physics dropped from a fixed start does not end in
an arbitrary mandated bucket. The only honest way to land in the right bucket is
to choose initial conditions whose physics **naturally** end there. Searching
for those conditions at runtime is too slow for edge buckets (it can freeze the
UI for seconds on the highest-multiplier wins).

So the search is done **offline, once**, and the result is stored in
`src/widgets/plinko-board/lib/canvas/physics-landing-table.generated.ts`. At
runtime `createBallMotion` just looks up a precomputed initial condition, picks
one by the round seed (for variety), and runs a single live simulation.

## How the pieces fit

```text
physics-landing-table.generated.ts   the precomputed table (generated artifact)
  -> physics.ts (createBallMotion)    looks up a (velocityX, seedValue) pair by seed
       -> physics-simulate.ts         runs ONE live simulation with that pair
            -> physics-collision.ts   peg collisions
            -> physics-geometry.ts    pegs, pyramid bounds, bucket geometry
            -> physics-constants.ts   gravity, damping, restitution, step
            -> animation.ts           board/peg/bucket geometry per layout
```

- `physics-simulate.ts` is the single source of truth for the physics. The
  generator (below) imports the **same** function, so there is no second copy
  of the physics to drift out of sync.
- `simulateBallMotion` reports `isTargetBucketHit`: whether the *natural*
  (uncorrected) trajectory ended inside the target bucket. That is exactly what
  the table records and what verification asserts.

## The runtime safety guard

`createBallMotion` calls `simulateBallMotion` with `correctOnMiss: true`. If a
looked-up entry does **not** land naturally (only possible with a stale or
incomplete table), the simulation eases the ball into the target bucket so the
shown bucket can never disagree with the backend payout, and `createBallMotion`
logs a `console.error`.

This means a stale table can never cause a money/payout mismatch. What it *does*
cause is the guard firing on every drop for the affected board — i.e. the
visible "slide into the bucket" returns. That is the maintainability cost of
letting the table go stale, and the reason to regenerate it.

## When the table goes stale

Regenerate whenever you change anything the search depends on:

- `physics-constants.ts` — `baseGravity`, `horizontalDamping`, `verticalDamping`,
  `restitution`, `wallRestitution`, `fixedStepMs`, `maxDurationMs`.
- `animation.ts` — any board geometry: `boardWidth`, `pyramidWidth`,
  `pyramidHeight`, `rowStartY`, peg radius/count, bucket sizing, the layout
  configs, or the spawn math.
- `physics-collision.ts` — collision resolution.
- The spawn / target-hit logic in `physics-simulate.ts` itself.

A fast signal that the table is stale: in development, `createBallMotion` logs
`[plinko] landing table is stale for ...` whenever the guard had to correct a
ball.

## How to regenerate (reproducible recipe)

The table maps `layout -> "rows:bucket" -> [vxIndex, seedIndex, ...]`, a flat
list of natural-hit pairs. Reconstruct each pair with:

```text
velocityX = VX_MIN + vxIndex * VX_STEP      // VX_MIN = -2200, VX_STEP = 40
seedValue = (seedIndex + 0.5) / SEED_COUNT  // SEED_COUNT = 16
```

Search parameters (must match the values encoded in the generated file):

| Parameter      | Value                                  |
| -------------- | -------------------------------------- |
| layouts        | regular, laptop, tablet, compact, narrow |
| rows           | 8 .. 16                                |
| bucket         | 0 .. rows                              |
| velocityX      | -2200 .. 2200 step 40 (111 values)     |
| seedValue      | (i + 0.5) / 16 for i in 0 .. 15        |
| pairs per cell | up to 12 (gentlest first); as few as 1 for hard edge buckets |

Algorithm:

1. For every `(layout, rows, bucket)`, sweep every `(velocityX, seedValue)`
   combination and run `simulateBallMotion({ bucketIndex, initialVelocityX,
   layout, rows, seedValue })` (leave `correctOnMiss` off so you measure the
   natural landing).
2. Keep only the pairs that land **and look good**: `isTargetBucketHit` is true,
   `touchedRail` is false, and the ball hit at least `max(3, round(rows * 0.4))`
   pegs (`motion.impactEvents.length`). These filters are what stop the ball
   ricocheting off the rail, tunnelling past the pegs, or flying off the board —
   they are essential, not optional. Skipping them reproduces the old, ugly
   animation even though every landing is still technically correct.
3. Prefer the gentlest `velocityX`. Apply the filter in widening tiers and take
   the **first non-empty** tier, so the vast majority of cells use small, calm
   velocities and only pathological edges loosen up:

   | tier | max \|velocityX\| | rail-free | min pegs            |
   | ---- | ----------------- | --------- | ------------------- |
   | 0    | 350               | yes       | max(3, round(.4r))  |
   | 1    | 600               | yes       | max(3, round(.4r))  |
   | 2    | 1000              | yes       | max(3, round(.4r))  |
   | 3    | 1600              | yes       | max(2, …-1)         |
   | 4    | 2200              | yes       | max(2, …-1)         |
   | 5    | 2200              | no        | max(2, …-1)         |
   | 6    | 2200              | no        | 1                   |

4. Sort the chosen tier by `|velocityX|` and sample evenly down to at most 12.
   A cell reachable by only one clean path keeps a single pair (no seed variety,
   by design).
5. Encode each cell as a flat `[vxIndex, seedIndex, ...]` array and write the
   generated module.

Run it as a throwaway local script (do not commit it). Two ways, pick what fits
your environment:

**Option A — import the real physics (no drift).** Recommended when you can run
TypeScript. Prerequisite: the runner must both execute TS **and** resolve the
project's `@/*` tsconfig path alias, because the physics modules import each
other through `@/` (a plain `node` cannot do this). Runners that honor
`tsconfig.json` `paths` work, e.g. `tsx` or `ts-node` + `tsconfig-paths`. These
are **not** project dependencies, so you must install one ad hoc (needs network
— may be unavailable in restricted CI). The snippet below uses this option.

**Option B — self-contained, zero dependencies (offline).** When you cannot
install a TS runner, write the scratch as plain ESM JavaScript runnable with
`node scratch.mjs` directly. Do **not** import the project modules; instead copy
the constants from `physics-constants.ts` and the layout configs + geometry from
`animation.ts` into the script. This is exactly how the committed table was
first produced. Trade-off: the copied values can drift from the source, so keep
them in sync and always re-run verification afterwards.

Option A snippet:

```ts
// scratch/gen.ts  (local only — delete after running)
import { writeFileSync } from "node:fs";
import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";
import { simulateBallMotion } from "@/widgets/plinko-board/lib/canvas/physics-simulate";

const SEED_COUNT = 16, VX_MIN = -2200, VX_MAX = 2200, VX_STEP = 40;
const VX_COUNT = Math.round((VX_MAX - VX_MIN) / VX_STEP) + 1;
const layouts: BoardLayout[] = ["regular", "laptop", "tablet", "compact", "narrow"];

const sampleEvenly = <T>(xs: T[], max: number) =>
  xs.length <= max
    ? xs
    : Array.from({ length: max }, (_, k) => xs[Math.round((k * (xs.length - 1)) / (max - 1))]);

type Hit = { vxIndex: number; seedIndex: number; absVx: number; touchedRail: boolean; pegs: number };

const select = (layout: BoardLayout, rows: number, bucket: number) => {
  const minPegs = Math.max(3, Math.round(rows * 0.4));
  const tiers = [
    { maxAbsVx: 350, railFree: true, minPegs },
    { maxAbsVx: 600, railFree: true, minPegs },
    { maxAbsVx: 1000, railFree: true, minPegs },
    { maxAbsVx: 1600, railFree: true, minPegs: Math.max(2, minPegs - 1) },
    { maxAbsVx: 2200, railFree: true, minPegs: Math.max(2, minPegs - 1) },
    { maxAbsVx: 2200, railFree: false, minPegs: Math.max(2, minPegs - 1) },
    { maxAbsVx: 2200, railFree: false, minPegs: 1 },
  ];
  const hits: Hit[] = [];
  for (let s = 0; s < SEED_COUNT; s += 1)
    for (let v = 0; v < VX_COUNT; v += 1) {
      const initialVelocityX = VX_MIN + v * VX_STEP;
      const r = simulateBallMotion({
        bucketIndex: bucket, initialVelocityX, layout, rows, seedValue: (s + 0.5) / SEED_COUNT,
      });
      if (r.isTargetBucketHit)
        hits.push({ vxIndex: v, seedIndex: s, absVx: Math.abs(initialVelocityX), touchedRail: r.touchedRail, pegs: r.motion.impactEvents.length });
    }
  for (const t of tiers) {
    const pool = hits.filter((h) => h.absVx <= t.maxAbsVx && (!t.railFree || !h.touchedRail) && h.pegs >= t.minPegs);
    if (pool.length) return sampleEvenly(pool.sort((a, b) => a.absVx - b.absVx), 12);
  }
  return [] as Hit[];
};

const entries = layouts.map((layout) => {
  const body: string[] = [];
  for (let rows = 8; rows <= 16; rows += 1)
    for (let bucket = 0; bucket <= rows; bucket += 1)
      body.push(`    "${rows}:${bucket}": [${select(layout, rows, bucket).flatMap((h) => [h.vxIndex, h.seedIndex]).join(",")}],`);
  return `  ${layout}: {\n${body.join("\n")}\n  },`;
});

writeFileSync(
  "src/widgets/plinko-board/lib/canvas/physics-landing-table.generated.ts",
  `export const SEED_COUNT = ${SEED_COUNT};\nexport const VX_MIN = ${VX_MIN};\nexport const VX_STEP = ${VX_STEP};\n\nexport const plinkoLandingTable: Record<string, Record<string, number[]>> = {\n${entries.join("\n")}\n};\n`,
);
```

The full sweep is slow (a few minutes per layout). Running each layout in its
own process in parallel cuts the wall time.

## How to verify

After regenerating (or to check the committed table against the current
physics), re-simulate every stored pair and assert it still lands naturally.
This is fast — it only replays the stored entries, not the full sweep. It has
the same runner prerequisite as Option A above (TS + `@/*` alias resolution), or
port it to self-contained `node` as in Option B:

```ts
// scratch/verify.ts  (local only — delete after running)
import type { BoardLayout } from "@/widgets/plinko-board/lib/animation";
import {
  SEED_COUNT, VX_MIN, VX_STEP, plinkoLandingTable,
} from "@/widgets/plinko-board/lib/canvas/physics-landing-table.generated";
import { simulateBallMotion } from "@/widgets/plinko-board/lib/canvas/physics-simulate";

let bad = 0;
for (const [layout, board] of Object.entries(plinkoLandingTable))
  for (const [key, pairs] of Object.entries(board)) {
    const [rows, bucket] = key.split(":").map(Number);
    for (let i = 0; i < pairs.length; i += 2)
      if (
        !simulateBallMotion({
          bucketIndex: bucket,
          initialVelocityX: VX_MIN + pairs[i] * VX_STEP,
          layout: layout as BoardLayout,
          rows,
          seedValue: (pairs[i + 1] + 0.5) / SEED_COUNT,
        }).isTargetBucketHit
      ) {
        bad += 1;
        console.error(`stale: ${layout} ${key} pair#${i / 2}`);
      }
  }
console.log(bad === 0 ? "PASS" : `FAIL: ${bad} stale entries`);
```

If verification fails, the physics or geometry changed since the table was
built — regenerate with the recipe above.

## Guarantee and variety

Offline runs confirm **every** `(layout, rows, bucket)` is populated — there is
always at least one clean, natural landing — so the runtime guard is a true
safety net, not the normal path.

Stored pairs per cell range from 1 to 12. Most cells hold several, which gives
the round seed real variety. A minority (about 41 of the ~585 cells — the hard
edge buckets, i.e. the highest multipliers) keep a **single** clean trajectory:
only one rail-free, peg-hitting path of modest velocity exists there, so those
buckets animate the same way on every drop. This is deliberate — one clean path
is better than padding the cell with trajectories that slam the rail or skip the
pegs. (The raw count of *natural* landings is larger; the quality filters above
are what reduce some cells to a single stored pair.)
