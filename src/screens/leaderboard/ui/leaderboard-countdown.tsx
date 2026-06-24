"use client";

import { useEffect, useState } from "react";

type CountdownItem = {
  label: "D" | "H" | "M" | "S";
  value: string;
};

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const defaultCountdownItems: CountdownItem[] = [
  { label: "D", value: "00" },
  { label: "H", value: "00" },
  { label: "M", value: "00" },
  { label: "S", value: "00" },
];

function formatCountdownUnit(value: number) {
  return String(value).padStart(2, "0");
}

function getCurrentMonthEndUtc(now: Date) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0),
  );
}

function getCountdownItems(now: Date): CountdownItem[] {
  const timeLeft = Math.max(getCurrentMonthEndUtc(now).getTime() - now.getTime(), 0);
  const days = Math.floor(timeLeft / DAY_IN_MS);
  const hours = Math.floor((timeLeft % DAY_IN_MS) / HOUR_IN_MS);
  const minutes = Math.floor((timeLeft % HOUR_IN_MS) / MINUTE_IN_MS);
  const seconds = Math.floor((timeLeft % MINUTE_IN_MS) / SECOND_IN_MS);

  return [
    { label: "D", value: formatCountdownUnit(days) },
    { label: "H", value: formatCountdownUnit(hours) },
    { label: "M", value: formatCountdownUnit(minutes) },
    { label: "S", value: formatCountdownUnit(seconds) },
  ];
}

export function LeaderboardCountdown() {
  const [countdownItems, setCountdownItems] = useState(defaultCountdownItems);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdownItems(getCountdownItems(new Date()));
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, SECOND_IN_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="mx-auto mt-4 flex h-[138px] w-[288px] flex-col items-center rounded-[18px] p-6 max-[374px]:w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
      }}
    >
      <p className="text-[16px] font-semibold leading-[125%] text-[#fdfdfd]">
        Competition ends in:
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {countdownItems.map((item) => (
          <div
            className="flex h-[54px] w-[51px] flex-col items-center justify-center rounded-lg bg-[#0e0f13] px-4 py-2"
            key={item.label}
          >
            <span className="text-[14px] font-semibold leading-[129%] text-[#fdfdfd]">
              {item.value}
            </span>
            <span className="text-[12px] font-semibold leading-[133%] text-[#566374]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
