"use client";

import Image, { type StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import chip1 from "@/assets/games/roulette/Coint_1.webp";
import chip5 from "@/assets/games/roulette/Coint_2.webp";
import chip25 from "@/assets/games/roulette/Coint_3.webp";
import chip50 from "@/assets/games/roulette/Coint_4.webp";
import chip250 from "@/assets/games/roulette/Coint_5.webp";
import chip25k from "@/assets/games/roulette/Coint_6.webp";
import chip500 from "@/assets/games/roulette/Coint_7.webp";
import chip2k from "@/assets/games/roulette/Coint_8.webp";
import chip5k from "@/assets/games/roulette/Coint_9.webp";
import chip50k from "@/assets/games/roulette/Coint_10.webp";
import type { NewRouletteBet, PlacedRouletteBet } from "../model/roulette-bets";
import {
  ROULETTE_BOARD_ROWS,
  ROULETTE_RED_NUMBERS,
} from "../model/roulette-constants";

type BettingBoardProps = {
  disabled: boolean;
  placedBets: PlacedRouletteBet[];
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
const CHIP_IMAGES = new Map<number, StaticImageData>([
  [1, chip1],
  [5, chip5],
  [25, chip25],
  [50, chip50],
  [250, chip250],
  [500, chip500],
  [2000, chip2k],
  [5000, chip5k],
  [25000, chip25k],
  [50000, chip50k],
]);
const CHIP_DENOMINATIONS = Array.from(CHIP_IMAGES.keys()).sort(
  (a, b) => a - b,
);

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
    "relative flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-transparent text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
    getNumberBackgroundClass(number),
    getStateClass(isHighlighted, isDimmed),
  ].join(" ");
}

function controlButtonClass(isHighlighted: boolean, isDimmed: boolean) {
  return [
    "relative flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
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
    "relative flex h-[46px] items-center justify-center rounded-[4px] border border-[rgba(63,74,89,0.5)] px-[9px] py-[14px] text-center text-[14px] font-semibold leading-[129%] text-[#fdfdfd] transition duration-150 disabled:opacity-60",
    backgroundClass,
    isHighlighted
      ? "border-white/80 brightness-110 shadow-[inset_0_0_0_999px_rgb(255_255_255_/_16%),inset_0_0_0_1px_rgb(255_255_255_/_34%)]"
      : "hover:border-white/55 hover:brightness-110",
    spanClass,
  ].join(" ");
}

function formatChipLabel(value: number) {
  return value >= 1000 ? `${value / 1000}K` : String(value);
}

function getBetKey(bet: NewRouletteBet) {
  if (bet.kind === "straight") {
    return `straight:${bet.straightNumber}`;
  }

  if (bet.kind === "color") {
    return `color:${bet.color}`;
  }

  if (bet.kind === "parity") {
    return `parity:${bet.parity}`;
  }

  if (bet.kind === "half") {
    return `half:${bet.half}`;
  }

  if (bet.kind === "dozen") {
    return `dozen:${bet.dozen}`;
  }

  return `column:${bet.column}`;
}

function buildBetAmountMap(bets: PlacedRouletteBet[]) {
  return bets.reduce((amounts, bet) => {
    const key = getBetKey(bet);

    amounts.set(key, (amounts.get(key) ?? 0) + bet.amount);

    return amounts;
  }, new Map<string, number>());
}

function getDisplayChipAmount(amount: number) {
  return (
    CHIP_DENOMINATIONS.findLast((denomination) => denomination <= amount) ?? 1
  );
}

function getStackChipAmount(amount: number) {
  return (
    CHIP_DENOMINATIONS.findLast((denomination) => {
      const nextDenomination = CHIP_DENOMINATIONS.find(
        (candidate) => candidate > denomination,
      );

      return amount >= denomination && amount < (nextDenomination ?? Infinity);
    }) ?? 1
  );
}

function PlacedChip({ amount }: { amount: number }) {
  const displayAmount = getDisplayChipAmount(amount);
  const stackChipAmount = getStackChipAmount(amount);
  const stackCount =
    amount === displayAmount
      ? 1
      : Math.min(4, Math.max(1, Math.floor(amount / stackChipAmount)));
  const image = CHIP_IMAGES.get(displayAmount) ?? chip1;
  const stackImage = CHIP_IMAGES.get(stackChipAmount) ?? chip1;
  const shouldShowAmount = amount !== displayAmount || stackCount > 1;
  const topOffset = (stackCount - 1) * 3;

  return (
    <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <span className="relative h-[34px] w-[34px]">
        {Array.from({ length: stackCount }).map((_, index) => {
          const isTopChip = index === stackCount - 1;
          const offset = index * 3;

          return (
            <Image
              alt=""
              className="absolute left-0 top-0 h-[34px] w-[34px] object-contain drop-shadow-[0_2px_1px_rgb(0_0_0_/_45%)]"
              draggable={false}
              key={`${amount}-${index}`}
              src={isTopChip ? image : stackImage}
              style={{
                transform: `translateY(-${offset}px)`,
                zIndex: isTopChip ? stackCount + 1 : index + 1,
              }}
            />
          );
        })}
        {shouldShowAmount ? (
          <span
            className="absolute left-[9px] top-[9px] z-20 grid h-[16px] w-[16px] place-items-center rounded-full bg-[#1b1f26]/95 text-[12px] font-semibold leading-none text-white"
            style={{ transform: `translateY(-${topOffset}px)` }}
          >
            {formatChipLabel(amount)}
          </span>
        ) : null}
      </span>
    </span>
  );
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

export function BettingBoard({
  disabled,
  placedBets,
  onPlaceBet,
}: BettingBoardProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea | null>(null);
  const betAmounts = useMemo(() => buildBetAmountMap(placedBets), [placedBets]);
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
            {betAmounts.has("straight:0") ? (
              <PlacedChip amount={betAmounts.get("straight:0") ?? 0} />
            ) : null}
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
                    const betKey = `straight:${number}`;
                    const placedAmount = betAmounts.get(betKey);

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
                        {placedAmount ? (
                          <PlacedChip amount={placedAmount} />
                        ) : null}
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
                  {betAmounts.has(`column:${COLUMN_BETS[rowIndex]}`) ? (
                    <PlacedChip
                      amount={
                        betAmounts.get(`column:${COLUMN_BETS[rowIndex]}`) ?? 0
                      }
                    />
                  ) : null}
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
            {betAmounts.has("dozen:FIRST") ? (
              <PlacedChip amount={betAmounts.get("dozen:FIRST") ?? 0} />
            ) : null}
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
            {betAmounts.has("dozen:SECOND") ? (
              <PlacedChip amount={betAmounts.get("dozen:SECOND") ?? 0} />
            ) : null}
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
            {betAmounts.has("dozen:THIRD") ? (
              <PlacedChip amount={betAmounts.get("dozen:THIRD") ?? 0} />
            ) : null}
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
            {betAmounts.has("half:LOW") ? (
              <PlacedChip amount={betAmounts.get("half:LOW") ?? 0} />
            ) : null}
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
            {betAmounts.has("parity:EVEN") ? (
              <PlacedChip amount={betAmounts.get("parity:EVEN") ?? 0} />
            ) : null}
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
          >
            {betAmounts.has("color:RED") ? (
              <PlacedChip amount={betAmounts.get("color:RED") ?? 0} />
            ) : null}
          </button>
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
          >
            {betAmounts.has("color:BLACK") ? (
              <PlacedChip amount={betAmounts.get("color:BLACK") ?? 0} />
            ) : null}
          </button>
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
            {betAmounts.has("parity:ODD") ? (
              <PlacedChip amount={betAmounts.get("parity:ODD") ?? 0} />
            ) : null}
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
            {betAmounts.has("half:HIGH") ? (
              <PlacedChip amount={betAmounts.get("half:HIGH") ?? 0} />
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
}
