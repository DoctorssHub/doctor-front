type DiceNumberFieldProps = {
  id: string;
  label: string;
  max?: number;
  min?: number;
  step?: number;
  suffix?: string;
  value: string;
  onChange: (value: number) => void;
};

export function DiceNumberField({
  id,
  label,
  max,
  min,
  step = 0.01,
  suffix,
  value,
  onChange,
}: DiceNumberFieldProps) {
  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-white">
        {label}
      </span>
      <span className="flex h-10 items-center rounded-md bg-[#252B36]/80 px-3">
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white/75 outline-none"
          id={id}
          inputMode="decimal"
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="number"
          value={value}
        />
        {suffix ? (
          <span className="ml-2 text-lg font-semibold text-white/80">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}
