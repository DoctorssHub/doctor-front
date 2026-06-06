const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type DigitWheelProps = {
  digit: string;
};

export function DigitWheel({ digit }: DigitWheelProps) {
  const digitIndex = Number(digit);

  return (
    <span className="relative grid h-[var(--reward-digit-height)] w-12 overflow-hidden rounded bg-(--color-surface-chip) text-[36px] font-black leading-none tabular-nums [--reward-digit-height:3.5rem] min-[1024px]:max-[1279px]:h-[51px] min-[1024px]:max-[1279px]:w-[46px] min-[1024px]:max-[1279px]:text-[33px] min-[1024px]:max-[1279px]:[--reward-digit-height:51px] min-[768px]:max-[1023px]:h-[46px] min-[768px]:max-[1023px]:w-[40px] min-[768px]:max-[1023px]:text-[29px] min-[768px]:max-[1023px]:[--reward-digit-height:46px] max-[767px]:h-[30px] max-[767px]:w-[26px] max-[767px]:text-[19px] max-[767px]:[--reward-digit-height:30px]">
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
