const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type DigitWheelProps = {
  digit: string;
};

export function DigitWheel({ digit }: DigitWheelProps) {
  const digitIndex = Number(digit);

  return (
    <span className="relative grid h-[var(--reward-digit-height)] w-12 overflow-hidden rounded bg-(--color-surface-chip) text-[36px] font-black leading-none tabular-nums [--reward-digit-height:3.5rem] laptop:max-large:h-[51px] laptop:max-large:w-[46px] laptop:max-large:text-[33px] laptop:max-large:[--reward-digit-height:51px] tablet:max-laptop:h-[46px] tablet:max-laptop:w-[40px] tablet:max-laptop:text-[29px] tablet:max-laptop:[--reward-digit-height:46px] max-tablet:h-[30px] max-tablet:w-[26px] max-tablet:text-[19px] max-tablet:[--reward-digit-height:30px]">
      <span
        className="grid transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(calc(-${digitIndex} * var(--reward-digit-height)))`,
        }}
      >
        {DIGITS.map((wheelDigit) => (
          <span
            className="grid h-[var(--reward-digit-height)] place-items-center"
            key={wheelDigit}
          >
            {wheelDigit}
          </span>
        ))}
      </span>
    </span>
  );
}
