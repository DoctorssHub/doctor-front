import { restitution } from "./physics-constants";
import { clamp } from "./physics-math";
import type { BallPosition } from "@/features/plinko/lib/board/animation";
import type { Peg, Velocity } from "./physics-types";

export function resolvePegCollision(
  position: BallPosition,
  velocity: Velocity,
  peg: Peg,
  ballRadius: number,
  collisionPosition = position,
) {
  const dx = collisionPosition.x - peg.x;
  const dy = collisionPosition.y - peg.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = ballRadius + peg.radius;

  if (distance >= minDistance) {
    return null;
  }

  const fallbackDistance = Math.hypot(velocity.x, velocity.y) || 1;
  const normalX = distance > 0 ? dx / distance : -velocity.x / fallbackDistance;
  const normalY = distance > 0 ? dy / distance : -velocity.y / fallbackDistance;
  const velocityAlongNormal = velocity.x * normalX + velocity.y * normalY;

  position.x = peg.x + normalX * minDistance;
  position.y = peg.y + normalY * minDistance;

  if (velocityAlongNormal < 0) {
    velocity.x -= (1 + restitution) * velocityAlongNormal * normalX;
    velocity.y -= (1 + restitution) * velocityAlongNormal * normalY;
  }

  velocity.x += normalX * 18;
  velocity.y += normalY * 18;

  return {
    x: peg.x,
    y: peg.y,
  };
}

function getClosestPointOnSegment(
  point: BallPosition,
  segmentStart: BallPosition,
  segmentEnd: BallPosition,
) {
  const segmentX = segmentEnd.x - segmentStart.x;
  const segmentY = segmentEnd.y - segmentStart.y;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (lengthSquared === 0) {
    return {
      point: segmentStart,
      progress: 0,
    };
  }

  const progress = clamp(
    ((point.x - segmentStart.x) * segmentX +
      (point.y - segmentStart.y) * segmentY) /
      lengthSquared,
    0,
    1,
  );

  return {
    point: {
      x: segmentStart.x + segmentX * progress,
      y: segmentStart.y + segmentY * progress,
    },
    progress,
  };
}

export function getNearestCollidingPeg(
  previousPosition: BallPosition,
  position: BallPosition,
  velocity: Velocity,
  pegs: Peg[],
  ballRadius: number,
) {
  let nearestPeg: Peg | null = null;
  let nearestCollisionPosition: BallPosition | null = null;
  let nearestProgress = Number.POSITIVE_INFINITY;
  let nearestDistance = Number.POSITIVE_INFINITY;

  pegs.forEach((peg) => {
    const closest = getClosestPointOnSegment(peg, previousPosition, position);
    const dx = closest.point.x - peg.x;
    const dy = closest.point.y - peg.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = ballRadius + peg.radius;

    if (distance >= minDistance) {
      return;
    }

    const fallbackDistance = Math.hypot(velocity.x, velocity.y) || 1;
    const normalX =
      distance > 0 ? dx / distance : -velocity.x / fallbackDistance;
    const normalY =
      distance > 0 ? dy / distance : -velocity.y / fallbackDistance;
    const velocityAlongNormal = velocity.x * normalX + velocity.y * normalY;

    if (
      velocityAlongNormal >= 0 ||
      closest.progress > nearestProgress ||
      (closest.progress === nearestProgress && distance >= nearestDistance)
    ) {
      return;
    }

    nearestPeg = peg;
    nearestCollisionPosition = closest.point;
    nearestProgress = closest.progress;
    nearestDistance = distance;
  });

  if (!nearestPeg || !nearestCollisionPosition) {
    return null;
  }

  return {
    peg: nearestPeg,
    position: nearestCollisionPosition,
  };
}
