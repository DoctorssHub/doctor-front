import type { BallPosition, BoardLayout } from "@/widgets/plinko-board/lib/animation";

export type Velocity = {
  x: number;
  y: number;
};

export type Peg = BallPosition & {
  radius: number;
};

export type PyramidBound = {
  left: number;
  right: number;
  y: number;
};

export type BucketGeometry = BallPosition & {
  left: number;
  right: number;
};

export type SimulationFrame = {
  ballPosition: BallPosition;
  timeMs: number;
};

export type ImpactEvent = {
  position: BallPosition;
  timeMs: number;
};

export type BallMotion = {
  durationMs: number;
  finalPosition: BallPosition;
  frames: SimulationFrame[];
  impactEvents: ImpactEvent[];
};

export type BallSimulationParams = {
  bucketIndex: number;
  layout?: BoardLayout;
  rows: number;
  seed?: string;
};
