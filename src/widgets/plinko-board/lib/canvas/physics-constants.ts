export const fixedStepMs = 1000 / 120;
export const maxDurationMs = 5200;
export const baseGravity = 1850;
export const restitution = 0.58;
export const wallRestitution = 0.46;
export const horizontalDamping = 0.992;
export const verticalDamping = 0.998;
export const minRowsForTimingScale = 8;
export const maxRowsForTimingScale = 16;
export const maxRowsTimingScale = 1.45;
// Used only by the stale-table safety guard in physics-simulate.ts.
export const targetSettleDurationMs = 180;
export const targetSettleFrameCount = 6;
