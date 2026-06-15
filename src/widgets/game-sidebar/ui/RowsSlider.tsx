import type { CSSProperties } from "react";

type RowsSliderProps = {
  id?: string;
  isDisabled?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number;
};

export function RowsSlider({
  id = "rows",
  isDisabled = false,
  label = "Rows",
  max = 16,
  min = 8,
  onChange,
  value,
}: RowsSliderProps) {
  const progress =
    max > min ? `${((value - min) / (max - min)) * 100}%` : "0%";

  return (
    <div className="mt-7 max-[1023px]:order-5 max-[1023px]:mt-5">
      <label
        className="mb-2 block text-sm font-semibold text-white"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span className="w-4 text-sm font-semibold text-white">{value}</span>
        <input
          className="game-sidebar-range h-1 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isDisabled}
          id={id}
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          style={
            {
              "--game-sidebar-range-progress": progress,
            } as CSSProperties
          }
          type="range"
          value={value}
        />
      </div>
    </div>
  );
}
