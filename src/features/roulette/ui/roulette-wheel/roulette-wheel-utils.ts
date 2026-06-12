import { ROULETTE_WHEEL_ORDER } from "../../model/roulette-constants";
import {
  ANGLE_PER_CELL,
  LANDING_DURATION_MS,
  OUTER_RADIUS,
  POCKET_CENTER_OFFSET,
  POCKET_RADIUS,
  WHEEL_SPEED,
} from "./roulette-wheel-constants";

export function smoothStep(value: number) {
  const clampedValue = Math.max(0, Math.min(1, value));

  return clampedValue * clampedValue * (3 - 2 * clampedValue);
}

export function getResultAngle(resultNumber: number, wheelAngle: number) {
  const cellAngle = getResultCellAngle(resultNumber);

  return cellAngle + (wheelAngle - WHEEL_SPEED * (LANDING_DURATION_MS / 1000));
}

export function getCurrentResultAngle(resultNumber: number, wheelAngle: number) {
  return getResultCellAngle(resultNumber) + wheelAngle;
}

export function getResultCellAngle(resultNumber: number) {
  const resultIndex = ROULETTE_WHEEL_ORDER.indexOf(
    resultNumber as (typeof ROULETTE_WHEEL_ORDER)[number],
  );
  const normalizedIndex = resultIndex >= 0 ? resultIndex : 0;

  return (
    normalizedIndex * ANGLE_PER_CELL +
    ANGLE_PER_CELL / 2 +
    POCKET_CENTER_OFFSET
  );
}

export function getShortestAngleDelta(fromAngle: number, toAngle: number) {
  let delta = toAngle - fromAngle;

  while (delta > 180) {
    delta -= 360;
  }

  while (delta < -180) {
    delta += 360;
  }

  return delta;
}

export function getLandingDelta(startAngle: number, targetAngle: number) {
  let delta = targetAngle - startAngle;

  while (delta > -1260) {
    delta -= 360;
  }

  while (delta < -1620) {
    delta += 360;
  }

  return delta;
}

export function getLandingRadius(progress: number) {
  if (progress < 0.5) {
    const bump = [
      [0.08, 0.03, 20],
      [0.22, 0.035, 26],
      [0.36, 0.03, 18],
    ].reduce((sum, [start, length, height]) => {
      const localProgress = (progress - start) / length;

      return localProgress >= 0 && localProgress <= 1
        ? sum + height * Math.sin(localProgress * Math.PI)
        : sum;
    }, 0);

    return OUTER_RADIUS + 2.4 * Math.sin(progress * Math.PI * 14) + bump;
  }

  if (progress < 0.62) {
    return OUTER_RADIUS - 31 * smoothStep((progress - 0.5) / 0.12);
  }

  if (progress < 0.71) {
    return 106 + 31 * smoothStep((progress - 0.62) / 0.09);
  }

  if (progress < 0.8) {
    return OUTER_RADIUS - 45 * smoothStep((progress - 0.71) / 0.09);
  }

  const settleProgress = (progress - 0.8) / 0.2;

  return (
    POCKET_RADIUS +
    12 * Math.sin(settleProgress * Math.PI * 8) * (1 - settleProgress) ** 2
  );
}

export function getBallTransform(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;

  return `translate(${radius * Math.sin(radians)}px, ${-radius * Math.cos(radians)}px) translate(-50%, -50%)`;
}
