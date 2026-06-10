"use client";

import { useState } from "react";
import type { NewRouletteBet } from "../model/roulette-bets";
import {
  ROULETTE_BOARD_ROWS,
  ROULETTE_RED_NUMBERS,
} from "../model/roulette-constants";

type BettingBoardProps = {
  disabled: boolean;
  onPlaceBet: (bet: NewRouletteBet) => void;
};

type HoverArea =
  | {
      kind: "numbers";
      numbers: readonly number[];
    }
  | {
      kind: "row";
      rowIndex: number;
      numbers: readonly number[];
    }
  | {
      kind: "range";
      min: number;
      max: number;
    }
  | {
      kind: "parity";
      parity: "EVEN" | "ODD";
    }
  | {
      kind: "color";
      color: "RED" | "BLACK";
    };

const COLUMN_BETS = ["TOP", "MIDDLE", "BOTTOM"] as const;

function getNumberBackgroundClass(number: number) {
  if (number === 0) {
    return "bg-[#16a34a]";
  }

  if (ROULETTE_RED_NUMBERS.has(number)) {
    return "bg-[#dc2626]";
  }

  return "bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)]";
}

function getStateClass(isHighlighted: boolean, isDimmed: boolean) {
  if (isHighlighted) {
    return "border-white/80 brightness-110 shadow-[inset_0_0_0_999px_rgb(255_255_255_/_16%),inset_0_0_0_1px_rgb(255_255_255_/_34%)]";
  }

  if (isDimmed) {
    return "border-transparent opacity-75 brightness-[0.82]";
  }

  return "hover:border-white/55 hover:brightness-110";
}

function numberButtonClass(
  number: number,
  isHighlighted: boolean,
  isDimmed: boolean,
) {
  return [
    "flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-transparent text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
    getNumberBackgroundClass(number),
    getStateClass(isHighlighted, isDimmed),
  ].join(" ");
}

function controlButtonClass(isHighlighted: boolean, isDimmed: boolean) {
  return [
    "flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
    "bg-[#0e121c]",
    isHighlighted || isDimmed
      ? getStateClass(isHighlighted, isDimmed)
      : "border-[rgba(63,74,89,0.5)] hover:border-white/55 hover:brightness-110",
  ].join(" ");
}

function lowerButtonClass(
  backgroundClass: string,
  isHighlighted: boolean,
  spanClass: string,
) {
  return [
    "flex h-[46px] items-center justify-center rounded-[4px] border border-[rgba(63,74,89,0.5)] px-[9px] py-[14px] text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
    backgroundClass,
    isHighlighted
      ? "border-white/80 brightness-110 shadow-[inset_0_0_0_999px_rgb(255_255_255_/_16%),inset_0_0_0_1px_rgb(255_255_255_/_34%)]"
      : "hover:border-white/55 hover:brightness-110",
    spanClass,
  ].join(" ");
}

function isNumberInHoverArea(number: number, hoverArea: HoverArea | null) {
  if (!hoverArea) {
    return false;
  }

  if (hoverArea.kind === "numbers" || hoverArea.kind === "row") {
    return hoverArea.numbers.includes(number);
  }

  if (number === 0) {
    return false;
  }

  if (hoverArea.kind === "range") {
    return number >= hoverArea.min && number <= hoverArea.max;
  }

  if (hoverArea.kind === "parity") {
    return hoverArea.parity === "EVEN" ? number % 2 === 0 : number % 2 === 1;
  }

  if (hoverArea.kind === "color") {
    const isRed = ROULETTE_RED_NUMBERS.has(number);

    return hoverArea.color === "RED" ? isRed : !isRed;
  }

  return false;
}

export function BettingBoard({ disabled, onPlaceBet }: BettingBoardProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea | null>(null);
  const hasActiveHover = hoverArea !== null;
  const isZeroHighlighted = isNumberInHoverArea(0, hoverArea);

  function getHoverHandlers(area: HoverArea) {
    return {
      onBlur: () => setHoverArea(null),
      onFocus: () => setHoverArea(area),
      onMouseEnter: () => setHoverArea(area),
      onMouseLeave: () => setHoverArea(null),
    };
  }

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="mx-auto min-w-[631px] max-w-[631px]">
        <div className="grid w-[625px] grid-cols-[40px_535px_40px] gap-[5px]">
          <button
            className={[
              numberButtonClass(
                0,
                isZeroHighlighted,
                hasActiveHover && !isZeroHighlighted,
              ),
              "row-span-3 !h-[130px]",
            ].join(" ")}
            disabled={disabled}
            {...getHoverHandlers({ kind: "numbers", numbers: [0] })}
            onClick={() => onPlaceBet({ kind: "straight", straightNumber: 0 })}
            type="button"
          >
            0
          </button>

          {ROULETTE_BOARD_ROWS.map((row, rowIndex) => {
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
                    const isHighlighted = isNumberInHoverArea(
                      number,
                      hoverArea,
                    );

                    return (
                      <button
                        className={numberButtonClass(
                          number,
                          isHighlighted,
                          hasActiveHover && !isHighlighted,
                        )}
                        disabled={disabled}
                        key={number}
                        {...getHoverHandlers({
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
                      </button>
                    );
                  })}
                </div>

                <button
                  className={controlButtonClass(
                    isColumnHighlighted,
                    hasActiveHover && !isColumnHighlighted,
                  )}
                  disabled={disabled}
                  {...getHoverHandlers(columnHoverArea)}
                  onClick={() =>
                    onPlaceBet({
                      kind: "column",
                      column: COLUMN_BETS[rowIndex],
                    })
                  }
                  type="button"
                >
                  2:1
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-[5px] grid w-[631px] grid-cols-3 gap-[5px]">
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "range" &&
                hoverArea.min === 1 &&
                hoverArea.max === 12,
              "",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "range", min: 1, max: 12 })}
            onClick={() => onPlaceBet({ kind: "dozen", dozen: "FIRST" })}
            type="button"
          >
            1 to 12
          </button>
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "range" &&
                hoverArea.min === 13 &&
                hoverArea.max === 24,
              "",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "range", min: 13, max: 24 })}
            onClick={() => onPlaceBet({ kind: "dozen", dozen: "SECOND" })}
            type="button"
          >
            13 to 24
          </button>
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "range" &&
                hoverArea.min === 25 &&
                hoverArea.max === 36,
              "",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "range", min: 25, max: 36 })}
            onClick={() => onPlaceBet({ kind: "dozen", dozen: "THIRD" })}
            type="button"
          >
            25 to 36
          </button>
        </div>

        <div className="mt-[5px] grid w-[631px] grid-cols-6 gap-[5px]">
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "range" &&
                hoverArea.min === 1 &&
                hoverArea.max === 18,
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "range", min: 1, max: 18 })}
            onClick={() => onPlaceBet({ kind: "half", half: "LOW" })}
            type="button"
          >
            1 to 18
          </button>
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "parity" && hoverArea.parity === "EVEN",
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "parity", parity: "EVEN" })}
            onClick={() => onPlaceBet({ kind: "parity", parity: "EVEN" })}
            type="button"
          >
            Even
          </button>
          <button
            aria-label="Red"
            className={lowerButtonClass(
              "bg-[#dc2626]",
              hoverArea?.kind === "color" && hoverArea.color === "RED",
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "color", color: "RED" })}
            onClick={() => onPlaceBet({ kind: "color", color: "RED" })}
            type="button"
          />
          <button
            aria-label="Black"
            className={lowerButtonClass(
              "bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)]",
              hoverArea?.kind === "color" && hoverArea.color === "BLACK",
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "color", color: "BLACK" })}
            onClick={() => onPlaceBet({ kind: "color", color: "BLACK" })}
            type="button"
          />
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "parity" && hoverArea.parity === "ODD",
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "parity", parity: "ODD" })}
            onClick={() => onPlaceBet({ kind: "parity", parity: "ODD" })}
            type="button"
          >
            Odd
          </button>
          <button
            className={lowerButtonClass(
              "bg-[#0e121c]",
              hoverArea?.kind === "range" &&
                hoverArea.min === 19 &&
                hoverArea.max === 36,
              "w-[101px]",
            )}
            disabled={disabled}
            {...getHoverHandlers({ kind: "range", min: 19, max: 36 })}
            onClick={() => onPlaceBet({ kind: "half", half: "HIGH" })}
            type="button"
          >
            19 to 36
          </button>
        </div>
      </div>
    </div>
  );
}
