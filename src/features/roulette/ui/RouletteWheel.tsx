"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import rouletteCenter from "@/assets/games/roulette/rouletteCenter.svg";
import rouletteImage from "@/assets/games/roulette/rouletteImage.svg";
import { ROULETTE_WHEEL_ORDER } from "../model/roulette-constants";

type RouletteWheelProps = {
  isSpinning: boolean;
  resultNumber: number | null;
};

const ANGLE_PER_CELL = 360 / ROULETTE_WHEEL_ORDER.length;
const LANDING_DURATION_MS = 3800;
const WHEEL_SPEED = 28;
const BALL_FAST_SPEED = 540;
const BALL_IDLE_SPEED = 72;
const OUTER_RADIUS = 137;
const MAX_BOUNCE_RADIUS = 154;
const POCKET_RADIUS = 98;
const POCKET_HOLD_MS = 1600;
const POCKET_EXIT_MS = 900;

function smoothStep(value: number) {
  const clampedValue = Math.max(0, Math.min(1, value));

  return clampedValue * clampedValue * (3 - 2 * clampedValue);
}

function getResultAngle(resultNumber: number, wheelAngle: number) {
  const cellAngle = getResultCellAngle(resultNumber);

  return cellAngle + (wheelAngle - WHEEL_SPEED * (LANDING_DURATION_MS / 1000));
}

function getResultCellAngle(resultNumber: number) {
  const resultIndex = ROULETTE_WHEEL_ORDER.indexOf(
    resultNumber as (typeof ROULETTE_WHEEL_ORDER)[number],
  );
  const normalizedIndex = resultIndex >= 0 ? resultIndex : 0;

  return normalizedIndex * ANGLE_PER_CELL;
}

function getLandingDelta(startAngle: number, targetAngle: number) {
  let delta = targetAngle - startAngle;

  while (delta > -1260) {
    delta -= 360;
  }

  while (delta < -1620) {
    delta += 360;
  }

  return delta;
}

function getLandingRadius(progress: number) {
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

export function RouletteWheel({ isSpinning, resultNumber }: RouletteWheelProps) {
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

      const radians = (angle * Math.PI) / 180;

      ballRef.current.style.transform = `translate(${radius * Math.sin(radians)}px, ${-radius * Math.cos(radians)}px)`;
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
    const targetAngle = getResultAngle(
      landingResultNumber,
      wheelAngleRef.current,
    );
    const landingDelta = getLandingDelta(startAngle, targetAngle);

    function moveBall(angle: number, radius: number) {
      if (!ballRef.current) {
        return;
      }

      const radians = (angle * Math.PI) / 180;

      ballRef.current.style.transform = `translate(${radius * Math.sin(radians)}px, ${-radius * Math.cos(radians)}px)`;
    }

    function land(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTimeRef.current) / LANDING_DURATION_MS,
        1,
      );
      const angle =
        startAngle + landingDelta * Math.sin((Math.PI / 2) * progress);
      const radius = Math.max(
        95,
        Math.min(MAX_BOUNCE_RADIUS, getLandingRadius(progress)),
      );

      moveBall(angle, radius);
      ballAngleRef.current = angle;
      ballRadiusRef.current = radius;

      if (progress < 1) {
        landingFrameRef.current = requestAnimationFrame(land);

        return;
      }

      moveBall(targetAngle, POCKET_RADIUS);
      ballAngleRef.current = targetAngle;
      ballRadiusRef.current = POCKET_RADIUS;
      settledCellAngleRef.current = getResultCellAngle(landingResultNumber);
      landingFrameRef.current = null;
      isLandingRef.current = false;
      isSettledRef.current = true;
      settledUntilRef.current = performance.now() + POCKET_HOLD_MS;
      fastUntilRef.current = 0;
    }

    landingFrameRef.current = requestAnimationFrame(land);
  }, [isSpinning, resultNumber]);

  return (
    <div className="flex min-h-[328px] items-center justify-center">
      <div
        className="relative select-none"
        style={{
          height: 324,
          transformStyle: "preserve-3d",
          width: 324,
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[image:var(--gradient-roulette-wheel-ring)]" />
        <div className="absolute left-1/2 top-1/2 h-[322px] w-[322px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-roulette-wheel-border)] bg-[image:var(--gradient-roulette-wheel-surface)]" />

        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] will-change-transform"
          ref={wheelRef}
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          <Image
            alt="roulette wheel"
            className="pointer-events-none h-full w-full object-contain"
            draggable={false}
            priority
            src={rouletteImage}
          />
          <div className="pointer-events-none absolute inset-0 z-[4] rounded-full bg-[image:var(--gradient-roulette-wheel-shine)]" />
          <div className="pointer-events-none absolute inset-0 z-[4] rounded-full bg-[image:var(--gradient-roulette-wheel-vignette)]" />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[90px] w-[90px] will-change-transform"
          ref={centerRef}
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          <Image
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
            priority
            src={rouletteCenter}
          />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[6] h-[10px] w-[10px] rounded-full bg-[image:var(--gradient-roulette-ball)] shadow-[var(--shadow-roulette-ball)] will-change-transform"
          ref={ballRef}
          style={{ transform: `translate(0px, -${OUTER_RADIUS}px)` }}
        />
      </div>
    </div>
  );
}
