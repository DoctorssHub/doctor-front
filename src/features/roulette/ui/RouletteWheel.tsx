import {
  ROULETTE_RED_NUMBERS,
  ROULETTE_WHEEL_ORDER,
} from "../model/roulette-constants";

type RouletteWheelProps = {
  isSpinning: boolean;
  resultNumber: number | null;
};

function getSlotClass(number: number, resultNumber: number | null) {
  const isResult = number === resultNumber;
  const colorClass =
    number === 0
      ? "bg-[var(--color-brand)]"
      : ROULETTE_RED_NUMBERS.has(number)
        ? "bg-[#ea2b2e]"
        : "bg-[var(--color-surface-elevated)]";

  return [
    "absolute left-1/2 top-1/2 grid h-5 w-5 place-items-center rounded-[3px] text-[8px] font-bold text-white",
    colorClass,
    isResult ? "ring-2 ring-[var(--color-accent-yellow)]" : "",
  ].join(" ");
}

export function RouletteWheel({ isSpinning, resultNumber }: RouletteWheelProps) {
  const resultRotation =
    resultNumber === null
      ? 0
      : ROULETTE_WHEEL_ORDER.indexOf(
          resultNumber as (typeof ROULETTE_WHEEL_ORDER)[number],
        ) *
        -9.73;

  return (
    <div className="flex min-h-[282px] items-center justify-center">
      <div className="relative grid h-[244px] w-[244px] place-items-center rounded-full border-[5px] border-[#153628] bg-[#080d18] shadow-[0_0_0_22px_rgb(14_24_36_/_45%)]">
        <div
          className={[
            "relative h-[202px] w-[202px] rounded-full border-[14px] border-[#101726] transition-transform duration-1000",
            isSpinning ? "animate-spin" : "",
          ].join(" ")}
          style={{
            transform: isSpinning ? undefined : `rotate(${resultRotation}deg)`,
          }}
        >
          {ROULETTE_WHEEL_ORDER.map((number, index) => {
            const angle = index * (360 / ROULETTE_WHEEL_ORDER.length);

            return (
              <span
                className={getSlotClass(number, resultNumber)}
                key={number}
                style={{
                  transform: `rotate(${angle}deg) translateY(-88px) rotate(90deg)`,
                }}
              >
                {number}
              </span>
            );
          })}
        </div>

        <div className="absolute grid h-16 w-16 place-items-center rounded-full bg-[#bba958] shadow-[inset_0_0_18px_rgb(255_255_255_/_45%)]">
          <div className="h-9 w-9 rounded-full bg-[#d6c779] shadow-[inset_0_0_12px_rgb(255_255_255_/_60%)]" />
        </div>

        <div className="absolute -top-1 h-0 w-0 border-x-[8px] border-t-[18px] border-x-transparent border-t-white" />
      </div>
    </div>
  );
}
