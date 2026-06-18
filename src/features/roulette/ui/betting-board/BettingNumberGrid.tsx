import type { NewRouletteBet } from "../../model/roulette-bets";
import { ROULETTE_BOARD_ROWS } from "../../model/roulette-constants";
import { COLUMN_BETS } from "./betting-board-constants";
import type { HoverArea, HoverHandlers } from "./betting-board-types";
import {
  controlButtonClass,
  isNumberInHoverArea,
  numberButtonClass,
} from "./betting-board-utils";
import { PlacedChip } from "./PlacedChip";

type BettingNumberGridProps = {
  betAmounts: Map<string, number>;
  disabled: boolean;
  hasActiveHover: boolean;
  hoverArea: HoverArea | null;
  isFullscreen?: boolean;
  isZeroHighlighted: boolean;
  onGetHoverHandlers: (area: HoverArea) => HoverHandlers;
  onPlaceBet: (bet: NewRouletteBet) => void;
};

export function BettingNumberGrid({
  betAmounts,
  disabled,
  hasActiveHover,
  hoverArea,
  isFullscreen = false,
  isZeroHighlighted,
  onGetHoverHandlers,
  onPlaceBet,
}: BettingNumberGridProps) {
  return (
    <div
      className={[
        "grid gap-[5px]",
        isFullscreen
          ? "w-full grid-cols-[minmax(80px,104px)_minmax(0,1fr)_minmax(60px,104px)]"
          : "w-[625px] grid-cols-[40px_535px_40px] tablet:max-laptop:w-[709px] tablet:max-laptop:grid-cols-[46px_607px_46px]",
      ].join(" ")}
    >
      <button
        className={[
          numberButtonClass(
            0,
            isZeroHighlighted,
            hasActiveHover && !isZeroHighlighted,
          ),
          "row-span-3 !h-[130px] tablet:max-laptop:!h-[148px]",
          isFullscreen ? "!w-full tablet:max-laptop:!w-full" : "",
        ].join(" ")}
        disabled={disabled}
        {...onGetHoverHandlers({ kind: "numbers", numbers: [0] })}
        onClick={() => onPlaceBet({ kind: "straight", straightNumber: 0 })}
        type="button"
      >
        0
        {betAmounts.has("straight:0") ? (
          <PlacedChip amount={betAmounts.get("straight:0") ?? 0} />
        ) : null}
      </button>

      {ROULETTE_BOARD_ROWS.map((row, rowIndex) => {
        const column = COLUMN_BETS[rowIndex];
        const columnHoverArea = {
          kind: "row",
          rowIndex,
          numbers: row,
        } satisfies HoverArea;
        const isColumnHighlighted =
          hoverArea?.kind === "row" && hoverArea.rowIndex === rowIndex;

        return (
          <div className="contents" key={`roulette-row-${rowIndex}`}>
            <div className="grid grid-cols-12 gap-[5px]">
              {row.map((number) => {
                const isHighlighted = isNumberInHoverArea(number, hoverArea);
                const betKey = `straight:${number}`;
                const placedAmount = betAmounts.get(betKey);

                return (
                  <button
                    className={[
                      numberButtonClass(
                        number,
                        isHighlighted,
                        hasActiveHover && !isHighlighted,
                      ),
                      isFullscreen ? "!w-full tablet:max-laptop:!w-full" : "",
                    ].join(" ")}
                    disabled={disabled}
                    key={number}
                    {...onGetHoverHandlers({
                      kind: "numbers",
                      numbers: [number],
                    })}
                    onClick={() =>
                      onPlaceBet({
                        kind: "straight",
                        straightNumber: number,
                      })
                    }
                    type="button"
                  >
                    {number}
                    {placedAmount ? <PlacedChip amount={placedAmount} /> : null}
                  </button>
                );
              })}
            </div>

            <button
              className={[
                controlButtonClass(
                  isColumnHighlighted,
                  hasActiveHover && !isColumnHighlighted,
                ),
                isFullscreen ? "!w-full tablet:max-laptop:!w-full" : "",
              ].join(" ")}
              disabled={disabled}
              {...onGetHoverHandlers(columnHoverArea)}
              onClick={() =>
                onPlaceBet({
                  kind: "column",
                  column,
                })
              }
              type="button"
            >
              2:1
              {betAmounts.has(`column:${column}`) ? (
                <PlacedChip amount={betAmounts.get(`column:${column}`) ?? 0} />
              ) : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}
