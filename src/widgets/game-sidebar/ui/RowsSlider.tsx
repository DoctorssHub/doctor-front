import type { CSSProperties } from "react";

type RowsSliderProps = {
  isDisabled?: boolean;
  onRowsChange: (rows: number) => void;
  rows: number;
};

export function RowsSlider({
  isDisabled = false,
  onRowsChange,
  rows,
}: RowsSliderProps) {
  return (
    <div className="mt-7 max-[1023px]:order-5 max-[1023px]:mt-5">
      <label
        className="mb-2 block text-sm font-semibold text-white"
        htmlFor="rows"
      >
        Rows
      </label>
      <div className="flex items-center gap-3">
        <span className="w-4 text-sm font-semibold text-white">{rows}</span>
        <input
          className="plinko-rows-range h-1 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isDisabled}
          id="rows"
          max={16}
          min={8}
          onChange={(event) => onRowsChange(Number(event.target.value))}
          style={
            {
              "--plinko-rows-progress": `${((rows - 8) / 8) * 100}%`,
            } as CSSProperties
          }
          type="range"
          value={rows}
        />
      </div>
    </div>
  );
}
