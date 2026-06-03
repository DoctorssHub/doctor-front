const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const DIGIT_HEIGHT_REM = 3.5;

type DigitWheelProps = {
  digit: string;
};

export function DigitWheel({ digit }: DigitWheelProps) {
  const digitIndex = Number(digit);

  return (
    <span className="relative grid h-14 w-12 overflow-hidden rounded bg-(--color-surface-chip) text-[36px] font-black leading-none tabular-nums">
      <span
        className="grid transition-transform duration-700 ease-out"
        style={{
          transform: `translateY(-${digitIndex * DIGIT_HEIGHT_REM}rem)`,
        }}
      >
        {DIGITS.map((wheelDigit) => (
          <span
            className="grid h-14 place-items-center"
            key={wheelDigit}
          >
            {wheelDigit}
          </span>
        ))}
      </span>
    </span>
  );
}
