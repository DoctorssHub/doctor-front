"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DigitWheel } from "./digit-wheel";

const INITIAL_REWARDS = 18368555;
const COUNT_ANIMATION_MS = 320000;
const COUNT_UPDATE_MS = 62000;
const COUNT_STEP_MS = 1200;

function formatRewardCount(value: number) {
  const digits = String(Math.floor(value));

  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)]
    .filter(Boolean)
    .join(",");
}

function getRewardIncrease() {
  return Math.floor(Math.random() * 17) + 12;
}

export function RewardCounter() {
  const [targetRewards, setTargetRewards] = useState(INITIAL_REWARDS);
  const [displayedRewards, setDisplayedRewards] = useState(INITIAL_REWARDS);
  const displayedRewardsRef = useRef(INITIAL_REWARDS);
  const animationIntervalRef = useRef<number | null>(null);

  const rewardCharacters = useMemo(
    () => formatRewardCount(displayedRewards).split(""),
    [displayedRewards],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTargetRewards((current) => current + getRewardIncrease());
    }, COUNT_UPDATE_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (animationIntervalRef.current !== null) {
      window.clearInterval(animationIntervalRef.current);
    }

    const from = displayedRewardsRef.current;
    const to = targetRewards;
    const start = performance.now();

    const animate = () => {
      const time = performance.now();
      const progress = Math.min((time - start) / COUNT_ANIMATION_MS, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(from + (to - from) * easedProgress);

      displayedRewardsRef.current = nextValue;
      setDisplayedRewards(nextValue);

      if (progress >= 1 && animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };

    animate();
    animationIntervalRef.current = window.setInterval(animate, COUNT_STEP_MS);

    return () => {
      if (animationIntervalRef.current !== null) {
        window.clearInterval(animationIntervalRef.current);
      }
    };
  }, [targetRewards]);

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-(--color-page-raised) pr-3 pl-5 py-3">
      <span className="text-[36px] font-black text-(--color-brand) mr-5">
        $
      </span>
      {rewardCharacters.map((character, index) =>
        character === "," ? (
          <span
            className=" grid h-1 w-1 place-items-end  text-[20px] font-black leading-none text-(--color-text-primary)"
            key={`separator-${index}`}
          >
            {character}
          </span>
        ) : (
          <DigitWheel
            digit={character}
            key={`digit-${index}`}
          />
        ),
      )}
    </div>
  );
}
