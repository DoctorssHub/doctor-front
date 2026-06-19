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
    <div className="overflow-x-auto text-center text-sm font-semibold text-[#fdfdfd]">
      <div className="mx-auto grid w-max gap-1">
        <div className="grid grid-cols-[48px_1fr] gap-1">
          <div
            className={[
              "grid place-items-center rounded-[6px] bg-[var(--color-roulette-green)]",
              resultNumber === 0
                ? "shadow-[0_0_0_2px_var(--color-highlight),0_0_20px_rgb(250_204_21/40%)]"
                : "",
            ].join(" ")}
          >
            0
          </div>

          <div className="grid gap-1">
            {ROULETTE_BOARD_ROWS.map((row) => (
              <div
                className="grid grid-cols-[repeat(12,40px)_40px] gap-1"
                key={row.join("-")}
              >
                {row.map((number) => {
                  const isRed = ROULETTE_RED_NUMBERS.has(number);
                  const isActive = resultNumber === number;

                  return (
                    <div
                      className={[
                        "grid size-10 place-items-center rounded-[6px]",
                        isRed
                          ? "bg-[var(--color-roulette-red)]"
                          : "bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)]",
                        isActive
                          ? "shadow-[0_0_0_2px_var(--color-highlight),0_0_20px_rgb(250_204_21/40%)]"
                          : "",
                      ].join(" ")}
                      key={number}
                    >
                      {number}
                    </div>
                  );
                })}
                <div
                  className="grid h-10 place-items-center rounded-[6px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]"
                  key={`side-${row[0]}`}
                >
                  2:1
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid h-[46px] grid-cols-3 gap-1">
          {["1 to 12", "13 to 24", "25 to 36"].map((label) => (
            <div
              className="grid place-items-center rounded-[4px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]"
              key={label}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid h-[46px] grid-cols-6 gap-1">
          <div className="grid place-items-center rounded-[4px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]">
            1 to 18
          </div>
          <div className="grid place-items-center rounded-[4px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]">
            Even
          </div>
          <div className="grid place-items-center rounded-[4px] bg-[var(--color-roulette-red)]" />
          <div className="grid place-items-center rounded-[4px] bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)]" />
          <div className="grid place-items-center rounded-[4px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]">
            Odd
          </div>
          <div className="grid place-items-center rounded-[4px] border border-[rgba(63,74,89,0.5)] bg-[#0e121c]">
            19 to 36
          </div>
        </div>
      </div>
    </div>
  );
}
