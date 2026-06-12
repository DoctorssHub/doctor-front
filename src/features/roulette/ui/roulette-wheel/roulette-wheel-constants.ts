import { ROULETTE_WHEEL_ORDER } from "../../model/roulette-constants";

export const ANGLE_PER_CELL = 360 / ROULETTE_WHEEL_ORDER.length;
export const POCKET_CENTER_OFFSET = -ANGLE_PER_CELL * 0.5;
export const LANDING_DURATION_MS = 3800;
export const WHEEL_SPEED = 28;
export const BALL_FAST_SPEED = 540;
export const BALL_IDLE_SPEED = 72;
export const OUTER_RADIUS = 126;
export const MAX_BOUNCE_RADIUS = 132;
export const POCKET_RADIUS = 92;
export const POCKET_HOLD_MS = 1600;
export const POCKET_EXIT_MS = 900;
