import {
  aimInertiaWeight,
  exitDriftWeight,
} from "./physics-constants";
import {
  getOutsideBucketDistance,
  isInsideTargetBucket,
} from "./physics-geometry";
import type { BallPosition } from "@/widgets/plinko-board/lib/animation";
import type { BucketGeometry, ImpactEvent } from "./physics-types";

type SimulationScoreParams = {
  ballRadius: number;
  exitX: number | null;
  impactEvents: ImpactEvent[];
  initialVelocityX: number;
  lastNaturalPosition: BallPosition;
  maxOutsidePyramidDistance: number;
  outsidePyramidFrameCount: number;
  rows: number;
  target: BucketGeometry;
};

export type SimulationScoreResult = {
  isTargetBucketHit: boolean;
  score: number;
  staysInPyramid: boolean;
};

export function calculateSimulationScore({
  ballRadius,
  exitX,
  impactEvents,
  initialVelocityX,
  lastNaturalPosition,
  maxOutsidePyramidDistance,
  outsidePyramidFrameCount,
  rows,
  target,
}: SimulationScoreParams): SimulationScoreResult {
  const xDistance = Math.abs(lastNaturalPosition.x - target.x);
  const yShortfall = Math.max(0, target.y - lastNaturalPosition.y);
  const outsideTargetBucketDistance = getOutsideBucketDistance(
    lastNaturalPosition.x,
    target,
  );
  const isTargetBucketHit =
    yShortfall <= ballRadius * 0.5 &&
    isInsideTargetBucket(lastNaturalPosition, target, ballRadius);
  const staysInPyramid =
    maxOutsidePyramidDistance <= ballRadius * 0.5 &&
    outsidePyramidFrameCount <= 2;
  const impactPenalty = impactEvents.length === 0 ? 400 : 0;
  const minExpectedImpacts = Math.max(3, Math.round(rows * 0.4));
  const sparseImpactPenalty =
    impactEvents.length < minExpectedImpacts
      ? (minExpectedImpacts - impactEvents.length) * 240
      : 0;
  const outsideBucketPenalty =
    xDistance > ballRadius * 2
      ? Math.pow(xDistance - ballRadius * 2, 1.12)
      : 0;
  const outsidePyramidPenalty =
    maxOutsidePyramidDistance * 140 + outsidePyramidFrameCount * 10;
  const wrongBucketPenalty =
    !isTargetBucketHit
      ? 50000 + outsideTargetBucketDistance * 1200 + xDistance * 120
      : 0;
  const earlyFinishPenalty =
    yShortfall > ballRadius * 0.5 ? 6000 + yShortfall * 120 : 0;
  const exitDrift = Math.abs((exitX ?? lastNaturalPosition.x) - target.x);
  const exitDriftPenalty = exitDrift * exitDriftWeight;
  const aimInertiaPenalty = Math.abs(initialVelocityX) * aimInertiaWeight;
  const targetAlignmentScore =
    outsideTargetBucketDistance > 0 ? xDistance : xDistance * 0.12;

  return {
    isTargetBucketHit,
    score:
      targetAlignmentScore +
      outsideBucketPenalty +
      wrongBucketPenalty +
      outsidePyramidPenalty +
      yShortfall * 2 +
      earlyFinishPenalty +
      impactPenalty +
      sparseImpactPenalty +
      exitDriftPenalty +
      aimInertiaPenalty,
    staysInPyramid,
  };
}
