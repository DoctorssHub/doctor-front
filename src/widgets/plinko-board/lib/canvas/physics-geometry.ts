import {
  type BallPosition,
  type BoardLayout,
  getBoardHeight,
  getBoardWidth,
  getBucketLayout,
  getPegPosition,
  getPegRadius,
} from "@/widgets/plinko-board/lib/animation";
import { clamp } from "./physics-math";
import type { BucketGeometry, Peg, PyramidBound } from "./physics-types";

export function getTargetBucketGeometry(
  bucketIndex: number,
  rows: number,
  layout: BoardLayout,
): BucketGeometry {
  const { bucketGap, bucketWidth, totalWidth } = getBucketLayout(rows, layout);
  const clampedBucketIndex = Math.min(rows, Math.max(0, bucketIndex));
  const firstBucketCenter =
    getBoardWidth(layout) / 2 - totalWidth / 2 + bucketWidth / 2;
  const x = firstBucketCenter + clampedBucketIndex * (bucketWidth + bucketGap);

  return {
    left: x - bucketWidth / 2,
    right: x + bucketWidth / 2,
    x,
    y: getBoardHeight(rows, layout) - 18,
  };
}

export function getSafeBucketBounds(
  bucket: BucketGeometry,
  ballRadius: number,
) {
  const padding = ballRadius * 0.35;

  return {
    left: bucket.left + padding,
    right: bucket.right - padding,
  };
}

export function isInsideTargetBucket(
  position: BallPosition,
  bucket: BucketGeometry,
  ballRadius: number,
) {
  const safeBucket = getSafeBucketBounds(bucket, ballRadius);

  return position.x >= safeBucket.left && position.x <= safeBucket.right;
}

export function getBucketLandingPosition(
  position: BallPosition,
  bucket: BucketGeometry,
  ballRadius: number,
) {
  const safeBucket = getSafeBucketBounds(bucket, ballRadius);

  return {
    x: clamp(position.x, safeBucket.left, safeBucket.right),
    y: bucket.y,
  };
}

export function getPegs(rows: number, layout: BoardLayout): Peg[] {
  const radius = getPegRadius(rows, layout);
  const pegs: Peg[] = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let pegIndex = 0; pegIndex < rowIndex + 3; pegIndex += 1) {
      pegs.push({
        ...getPegPosition(rowIndex, pegIndex, rows, layout),
        radius,
      });
    }
  }

  return pegs;
}

export function getPyramidBounds(
  rows: number,
  layout: BoardLayout,
  ballRadius: number,
) {
  const bounds: PyramidBound[] = [];
  const sidePadding = ballRadius * 3;

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const firstPeg = getPegPosition(rowIndex, 0, rows, layout);
    const lastPeg = getPegPosition(rowIndex, rowIndex + 2, rows, layout);

    bounds.push({
      left: firstPeg.x - sidePadding,
      right: lastPeg.x + sidePadding,
      y: firstPeg.y,
    });
  }

  return bounds;
}

export function getInterpolatedPyramidBound(
  bounds: PyramidBound[],
  y: number,
) {
  if (bounds.length === 0) {
    return null;
  }

  const firstBound = bounds[0];
  const lastBound = bounds[bounds.length - 1];

  if (y < firstBound.y) {
    return firstBound;
  }

  if (y > lastBound.y) {
    return null;
  }

  const nextBoundIndex = bounds.findIndex((bound) => bound.y >= y);

  if (nextBoundIndex <= 0) {
    return firstBound;
  }

  const previousBound = bounds[nextBoundIndex - 1];
  const nextBound = bounds[nextBoundIndex];
  const progress = clamp(
    (y - previousBound.y) / (nextBound.y - previousBound.y),
    0,
    1,
  );

  return {
    left: previousBound.left + (nextBound.left - previousBound.left) * progress,
    right:
      previousBound.right + (nextBound.right - previousBound.right) * progress,
    y,
  };
}
