import { useEffect, useRef } from "react";
import {
  BALL_FAST_SPEED,
  BALL_IDLE_SPEED,
  LANDING_DURATION_MS,
  MAX_BOUNCE_RADIUS,
  OUTER_RADIUS,
  POCKET_EXIT_MS,
  POCKET_HOLD_MS,
  POCKET_RADIUS,
  WHEEL_SPEED,
} from "./roulette-wheel-constants";
import {
  getBallTransform,
  getCurrentResultAngle,
  getLandingDelta,
  getLandingRadius,
  getResultAngle,
  getResultCellAngle,
  getShortestAngleDelta,
  smoothStep,
} from "./roulette-wheel-utils";

type UseRouletteWheelAnimationParams = {
  isSpinning: boolean;
  onLandingComplete?: () => void;
  resultNumber: number | null;
};

export function useRouletteWheelAnimation({
  isSpinning,
  onLandingComplete,
  resultNumber,
}: UseRouletteWheelAnimationParams) {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const idleFrameRef = useRef<number | null>(null);
  const landingFrameRef = useRef<number | null>(null);
  const wheelAngleRef = useRef(0);
  const centerAngleRef = useRef(0);
  const ballAngleRef = useRef(0);
  const ballRadiusRef = useRef(OUTER_RADIUS);
  const isLandingRef = useRef(false);
  const isSettledRef = useRef(false);
  const settledCellAngleRef = useRef(0);
  const settledUntilRef = useRef(0);
  const fastUntilRef = useRef(0);

  useEffect(() => {
    function moveBall(angle: number, radius: number) {
      if (!ballRef.current) {
        return;
      }

      ballRef.current.style.transform = getBallTransform(angle, radius);
    }

    let previousTimestamp: number | null = null;

    function tick(timestamp: number) {
      const previousFrameTimestamp = previousTimestamp ?? timestamp;
      const deltaTime = Math.min(timestamp - previousFrameTimestamp, 100);
      previousTimestamp = timestamp;

      wheelAngleRef.current -= (deltaTime / 1000) * WHEEL_SPEED;
      centerAngleRef.current += (deltaTime / 1000) * WHEEL_SPEED;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${wheelAngleRef.current}deg)`;
      }

      if (centerRef.current) {
        centerRef.current.style.transform = `translate(-50%, -50%) rotate(${centerAngleRef.current}deg)`;
      }

      if (isSettledRef.current) {
        const exitProgress =
          timestamp < settledUntilRef.current
            ? 0
            : Math.min(
                (timestamp - settledUntilRef.current) / POCKET_EXIT_MS,
                1,
              );
        const easedExitProgress = smoothStep(exitProgress);

        ballAngleRef.current =
          settledCellAngleRef.current +
          wheelAngleRef.current +
          easedExitProgress * 32;
        ballRadiusRef.current =
          POCKET_RADIUS + (OUTER_RADIUS - POCKET_RADIUS) * easedExitProgress;
        moveBall(ballAngleRef.current, ballRadiusRef.current);

        if (exitProgress >= 1) {
          isSettledRef.current = false;
        }
      } else if (!isLandingRef.current) {
        if (timestamp < fastUntilRef.current) {
          ballAngleRef.current -= (deltaTime / 1000) * BALL_FAST_SPEED;
        } else {
          ballAngleRef.current += (deltaTime / 1000) * BALL_IDLE_SPEED;
          ballRadiusRef.current = Math.min(
            OUTER_RADIUS,
            ballRadiusRef.current + (deltaTime / 1000) * 60,
          );
        }

        moveBall(ballAngleRef.current, ballRadiusRef.current);
      }

      idleFrameRef.current = requestAnimationFrame(tick);
    }

    idleFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (idleFrameRef.current !== null) {
        cancelAnimationFrame(idleFrameRef.current);
      }

      if (landingFrameRef.current !== null) {
        cancelAnimationFrame(landingFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSpinning) {
      isSettledRef.current = false;
      settledUntilRef.current = 0;
      fastUntilRef.current = performance.now() + LANDING_DURATION_MS;
    }
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning || resultNumber === null) {
      return;
    }

    const landingResultNumber = resultNumber;

    isLandingRef.current = true;

    if (landingFrameRef.current !== null) {
      cancelAnimationFrame(landingFrameRef.current);
    }

    const startAngle = ballAngleRef.current;
    const startTimeRef = { current: null as number | null };
    const initialTargetAngle = getResultAngle(
      landingResultNumber,
      wheelAngleRef.current,
    );
    const landingDelta = getLandingDelta(startAngle, initialTargetAngle);

    function moveBall(angle: number, radius: number) {
      if (!ballRef.current) {
        return;
      }

      ballRef.current.style.transform = getBallTransform(angle, radius);
    }

    function land(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTimeRef.current) / LANDING_DURATION_MS,
        1,
      );
      const currentTargetAngle = getCurrentResultAngle(
        landingResultNumber,
        wheelAngleRef.current,
      );
      const targetDrift = getShortestAngleDelta(
        initialTargetAngle,
        currentTargetAngle,
      );
      const angle =
        startAngle +
        landingDelta * Math.sin((Math.PI / 2) * progress) +
        targetDrift * smoothStep(progress);
      const radius = Math.max(
        90,
        Math.min(MAX_BOUNCE_RADIUS, getLandingRadius(progress)),
      );

      moveBall(angle, radius);
      ballAngleRef.current = angle;
      ballRadiusRef.current = radius;

      if (progress < 1) {
        landingFrameRef.current = requestAnimationFrame(land);

        return;
      }

      const finalTargetAngle = getCurrentResultAngle(
        landingResultNumber,
        wheelAngleRef.current,
      );

      moveBall(finalTargetAngle, POCKET_RADIUS);
      ballAngleRef.current = finalTargetAngle;
      ballRadiusRef.current = POCKET_RADIUS;
      settledCellAngleRef.current = getResultCellAngle(landingResultNumber);
      landingFrameRef.current = null;
      isLandingRef.current = false;
      isSettledRef.current = true;
      settledUntilRef.current = performance.now() + POCKET_HOLD_MS;
      fastUntilRef.current = 0;
      onLandingComplete?.();
    }

    landingFrameRef.current = requestAnimationFrame(land);
  }, [isSpinning, onLandingComplete, resultNumber]);

  return {
    ballRef,
    centerRef,
    initialBallTransform: getBallTransform(0, OUTER_RADIUS),
    wheelRef,
  };
}
