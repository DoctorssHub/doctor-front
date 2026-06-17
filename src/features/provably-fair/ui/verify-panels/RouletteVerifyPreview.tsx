import {
  ROULETTE_BOARD_ROWS,
  ROULETTE_RED_NUMBERS,
} from "@/features/roulette/model/roulette-constants";

type RouletteVerifyPreviewProps = {
  resultNumber: number | null;
};

export function RouletteVerifyPreview({
  resultNumber,
}: RouletteVerifyPreviewProps) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-1">
      <div
        className={[
          "grid place-items-center rounded-md bg-[var(--color-roulette-green)] text-sm font-bold",
          resultNumber === 0
            ? "shadow-[0_0_0_2px_var(--color-brand),0_0_20px_rgb(34_197_94/45%)]"
            : "",
        ].join(" ")}
      >
        0
      </div>
      <div className="grid gap-1">
        {ROULETTE_BOARD_ROWS.map((row) => (
          <div className="grid grid-cols-12 gap-1" key={row.join("-")}>
            {row.map((number) => {
              const isRed = ROULETTE_RED_NUMBERS.has(number);
              const isActive = resultNumber === number;

              return (
                <div
                  className={[
                    "grid h-8 place-items-center rounded border text-xs font-bold",
                    isRed
                      ? "border-[var(--color-roulette-red)] bg-[var(--color-roulette-red)]"
                      : "border-[var(--color-border-button)] bg-[var(--color-surface-elevated)]",
                    isActive
                      ? "shadow-[0_0_0_2px_var(--color-brand),0_0_20px_rgb(34_197_94/45%)]"
                      : "",
                  ].join(" ")}
                  key={number}
                >
                  {number}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
