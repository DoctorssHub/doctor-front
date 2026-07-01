import { memo } from "react";

import type { NewRouletteBet } from "../../model/roulette-bets";
import {
  ROULETTE_BOARD_ROWS,
  ROULETTE_RED_NUMBERS,
} from "../../model/roulette-constants";
import { COLUMN_BETS } from "./betting-board-constants";
import { controlButtonClass, numberButtonClass } from "./betting-board-utils";
import { PlacedChip } from "./PlacedChip";

type BettingNumberGridProps = {
  betAmounts: Map<string, number>;
  disabled: boolean;
  isFullscreen?: boolean;
  onPlaceBet: (bet: NewRouletteBet) => void;
};

type StraightNumberButtonProps = {
  amount?: number;
  disabled: boolean;
  hasCoveredBet: boolean;
  isFullscreen: boolean;
  number: number;
  onPlaceBet: (bet: NewRouletteBet) => void;
  sizeClassName?: string;
};

type ColumnBetButtonProps = {
  amount?: number;
  column: string;
  disabled: boolean;
  hasCoveredBet: boolean;
  isFullscreen: boolean;
  onPlaceBet: (bet: NewRouletteBet) => void;
};


function getNumberDataAttributes(number: number) {
  if (number === 0) {
    return {
      "data-hover-numbers": "0",
      "data-roulette-number": "0",
    };
  }

  return {
    "data-hover-numbers": String(number),
    "data-roulette-color": ROULETTE_RED_NUMBERS.has(number) ? "RED" : "BLACK",
    "data-roulette-dozen":
      number <= 12 ? "FIRST" : number <= 24 ? "SECOND" : "THIRD",
    "data-roulette-half": number <= 18 ? "LOW" : "HIGH",
    "data-roulette-number": String(number),
    "data-roulette-parity": number % 2 === 0 ? "EVEN" : "ODD",
  };
}

const StraightNumberButton = memo(function StraightNumberButton({
  amount,
  disabled,
  hasCoveredBet,
  isFullscreen,
  number,
  onPlaceBet,
  sizeClassName = "",
}: StraightNumberButtonProps) {
  return (
    <button
      className={[
        "roulette-board-cell roulette-board-trigger",
        numberButtonClass(number, false, false),
        sizeClassName,
        isFullscreen ? "!w-full tablet:max-laptop:!w-full" : "",
      ].join(" ")}
      data-has-bet={hasCoveredBet ? "true" : undefined}
      disabled={disabled}
      {...getNumberDataAttributes(number)}
      onClick={() => onPlaceBet({ kind: "straight", straightNumber: number })}
      type="button"
    >
      {number}
      {amount ? <PlacedChip amount={amount} /> : null}
    </button>
  );
});

const ColumnBetButton = memo(function ColumnBetButton({
  amount,
  column,
  disabled,
  hasCoveredBet,
  isFullscreen,
  onPlaceBet,
}: ColumnBetButtonProps) {
  return (
    <button
      className={[
        "roulette-board-cell roulette-board-trigger",
        controlButtonClass(false, false),
        isFullscreen ? "!w-full tablet:max-laptop:!w-full" : "",
      ].join(" ")}
      data-has-bet={hasCoveredBet ? "true" : undefined}
      data-hover-row={column}
      disabled={disabled}
      onClick={() =>
        onPlaceBet({
          kind: "column",
          column,
        })
      }
      type="button"
    >
      2:1
      {amount ? <PlacedChip amount={amount} /> : null}
    </button>
  );
});

export function BettingNumberGrid({
  betAmounts,
  disabled,
  isFullscreen = false,
  onPlaceBet,
}: BettingNumberGridProps) {
  return (
    <div
      className={[
        "roulette-board grid gap-[5px]",
        isFullscreen
          ? "w-full grid-cols-[minmax(80px,104px)_minmax(0,1fr)_minmax(60px,104px)]"
          : "w-[625px] grid-cols-[40px_535px_40px] tablet:max-laptop:w-[709px] tablet:max-laptop:grid-cols-[46px_607px_46px]",
      ].join(" ")}
    >
      <StraightNumberButton
        amount={betAmounts.get("straight:0")}
        disabled={disabled}
        hasCoveredBet={Boolean(betAmounts.get("straight:0"))}
        isFullscreen={isFullscreen}
        number={0}
        onPlaceBet={onPlaceBet}
        sizeClassName="row-span-3 !h-[130px] tablet:max-laptop:!h-[148px]"
      />

      {ROULETTE_BOARD_ROWS.map((row, rowIndex) => {
        const column = COLUMN_BETS[rowIndex];

        return (
          <div
            className="roulette-board-row contents"
            data-roulette-row={column}
            key={`roulette-row-${rowIndex}`}
          >
            <div className="grid grid-cols-12 gap-[5px]">
              {row.map((number) => (
                <StraightNumberButton
                  amount={betAmounts.get(`straight:${number}`)}
                  disabled={disabled}
                  hasCoveredBet={Boolean(betAmounts.get(`straight:${number}`))}
                  isFullscreen={isFullscreen}
                  key={number}
                  number={number}
                  onPlaceBet={onPlaceBet}
                />
              ))}
            </div>

            <ColumnBetButton
              amount={betAmounts.get(`column:${column}`)}
              column={column}
              disabled={disabled}
              hasCoveredBet={Boolean(betAmounts.get(`column:${column}`))}
              isFullscreen={isFullscreen}
              onPlaceBet={onPlaceBet}
            />
          </div>
        );
      })}
    </div>
  );
}