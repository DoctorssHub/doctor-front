import Image from "next/image";
import clearIcon from "@/assets/games/roulette/clearIcon.svg";
import undoIcon from "@/assets/games/roulette/undoIcon.svg";
import type { NewRouletteBet } from "../../../model/roulette-bets";
import { ROULETTE_BOARD_ROWS } from "../../../model/roulette-constants";
import { COLUMN_BETS } from "../betting-board-constants";
import type { HoverArea, HoverHandlers } from "../betting-board-types";
import {
  getNumberBackgroundClass,
  getStraightBetAmount,
  isNumberInHoverArea,
} from "../betting-board-utils";
import {
  MOBILE_DOZEN_AREAS,
  MOBILE_NUMBER_ROWS,
} from "./mobile-betting-board-constants";
import { MobileBetButton } from "./MobileBetButton";

type MobileBettingBoardProps = {
  betAmounts: Map<string, number>;
  canUndo: boolean;
  disabled: boolean;
  hoverArea: HoverArea | null;
  onClear: () => void;
  onGetHoverHandlers: (area: HoverArea) => HoverHandlers;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onUndo: () => void;
};

export function MobileBettingBoard({
  betAmounts,
  canUndo,
  disabled,
  hoverArea,
  onClear,
  onGetHoverHandlers,
  onPlaceBet,
  onUndo,
}: MobileBettingBoardProps) {
  const isZeroHighlighted =
    hoverArea?.kind === "numbers" && hoverArea.numbers.includes(0);

  return (
    <div className="hidden w-[258px] max-tablet:ml-auto mr-4 max-tablet:grid max-tablet:grid-cols-[58px_58px_128px] max-tablet:gap-[7px]">
      <div className="flex h-[625px] w-[58px] flex-col justify-between">
        <MobileBetButton
          amount={betAmounts.get("half:LOW")}
          className="h-[80px] w-[58px] bg-[var(--color-surface)] text-[14px]"
          disabled={disabled}
          isHighlighted={
            hoverArea?.kind === "range" &&
            hoverArea.min === 1 &&
            hoverArea.max === 18
          }
          onClick={() => onPlaceBet({ kind: "half", half: "LOW" })}
          onHoverHandlers={onGetHoverHandlers({ kind: "range", min: 1, max: 18 })}
        >
          1 to 18
        </MobileBetButton>
        <MobileBetButton
          amount={betAmounts.get("parity:EVEN")}
          className="h-[80px] w-[58px] bg-[var(--color-surface)] text-[14px]"
          disabled={disabled}
          isHighlighted={hoverArea?.kind === "parity" && hoverArea.parity === "EVEN"}
          onClick={() => onPlaceBet({ kind: "parity", parity: "EVEN" })}
          onHoverHandlers={onGetHoverHandlers({ kind: "parity", parity: "EVEN" })}
        >
          Even
        </MobileBetButton>
        <MobileBetButton
          amount={betAmounts.get("color:RED")}
          ariaLabel="Red"
          className="h-[113px] w-[58px] bg-[var(--color-roulette-red)]"
          disabled={disabled}
          isHighlighted={hoverArea?.kind === "color" && hoverArea.color === "RED"}
          onClick={() => onPlaceBet({ kind: "color", color: "RED" })}
          onHoverHandlers={onGetHoverHandlers({ kind: "color", color: "RED" })}
        />
        <MobileBetButton
          amount={betAmounts.get("color:BLACK")}
          ariaLabel="Black"
          className="h-[113px] w-[58px] bg-[image:var(--gradient-roulette-dark-cell)]"
          disabled={disabled}
          isHighlighted={hoverArea?.kind === "color" && hoverArea.color === "BLACK"}
          onClick={() => onPlaceBet({ kind: "color", color: "BLACK" })}
          onHoverHandlers={onGetHoverHandlers({ kind: "color", color: "BLACK" })}
        />
        <MobileBetButton
          amount={betAmounts.get("parity:ODD")}
          className="h-[80px] w-[58px] bg-[var(--color-surface)] text-[14px]"
          disabled={disabled}
          isHighlighted={hoverArea?.kind === "parity" && hoverArea.parity === "ODD"}
          onClick={() => onPlaceBet({ kind: "parity", parity: "ODD" })}
          onHoverHandlers={onGetHoverHandlers({ kind: "parity", parity: "ODD" })}
        >
          Odd
        </MobileBetButton>
        <MobileBetButton
          amount={betAmounts.get("half:HIGH")}
          className="h-[80px] w-[58px] bg-[var(--color-surface)] text-[14px]"
          disabled={disabled}
          isHighlighted={
            hoverArea?.kind === "range" &&
            hoverArea.min === 19 &&
            hoverArea.max === 36
          }
          onClick={() => onPlaceBet({ kind: "half", half: "HIGH" })}
          onHoverHandlers={onGetHoverHandlers({
            kind: "range",
            min: 19,
            max: 36,
          })}
        >
          19 to 36
        </MobileBetButton>
        <div className="w-[58px]">
          <button
            aria-label="Clear"
            className="grid h-10 w-[58px] place-items-center rounded-[4px] border border-[var(--color-surface-icon)] bg-[image:var(--gradient-roulette-action-button)] transition hover:brightness-110 disabled:opacity-45"
            disabled={!canUndo || disabled}
            onClick={onClear}
            type="button"
          >
            <Image alt="" className="h-5 w-5" src={clearIcon} />
          </button>
        </div>
      </div>

      <div className="flex h-[625px] w-[58px] flex-col justify-between">
        {MOBILE_DOZEN_AREAS.map((area) => (
          <MobileBetButton
            amount={betAmounts.get(`dozen:${area.dozen}`)}
            className="h-[191px] w-[58px] bg-[var(--color-surface)] text-[14px]"
            disabled={disabled}
            isHighlighted={
              hoverArea?.kind === "range" &&
              hoverArea.min === area.min &&
              hoverArea.max === area.max
            }
            key={area.dozen}
            onClick={() => onPlaceBet({ kind: "dozen", dozen: area.dozen })}
            onHoverHandlers={onGetHoverHandlers({
              kind: "range",
              min: area.min,
              max: area.max,
            })}
          >
            {area.label}
          </MobileBetButton>
        ))}
        <button
          aria-label="Undo"
          className="grid h-10 w-[58px] place-items-center rounded-[4px] border border-[var(--color-surface-icon)] bg-[image:var(--gradient-roulette-action-button)] transition hover:brightness-110 disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={onUndo}
          type="button"
        >
          <Image alt="" className="h-5 w-5" src={undoIcon} />
        </button>
      </div>

      <div className="flex h-[625px] w-[128px] flex-col justify-between">
        <MobileBetButton
          amount={getStraightBetAmount(betAmounts, 0)}
          className="h-10 w-[128px] bg-[var(--color-roulette-green)] text-[18px]"
          disabled={disabled}
          isHighlighted={isZeroHighlighted}
          onClick={() => onPlaceBet({ kind: "straight", straightNumber: 0 })}
          onHoverHandlers={onGetHoverHandlers({ kind: "numbers", numbers: [0] })}
        >
          0
        </MobileBetButton>

        <div className="grid grid-cols-3 gap-1">
          {MOBILE_NUMBER_ROWS.flatMap((row) =>
            row.map((number) => {
              const isHighlighted = isNumberInHoverArea(number, hoverArea);

              return (
                <MobileBetButton
                  amount={getStraightBetAmount(betAmounts, number)}
                  className={[
                    "h-10 w-10 text-[14px]",
                    getNumberBackgroundClass(number),
                  ].join(" ")}
                  disabled={disabled}
                  isHighlighted={isHighlighted}
                  key={number}
                  onClick={() =>
                    onPlaceBet({ kind: "straight", straightNumber: number })
                  }
                  onHoverHandlers={onGetHoverHandlers({
                    kind: "numbers",
                    numbers: [number],
                  })}
                >
                  {number}
                </MobileBetButton>
              );
            }),
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {COLUMN_BETS.map((column, index) => {
            const rowNumbers = ROULETTE_BOARD_ROWS[index];
            const isHighlighted =
              hoverArea?.kind === "row" && hoverArea.rowIndex === index;

            return (
              <MobileBetButton
                amount={betAmounts.get(`column:${column}`)}
                className="h-10 w-10 bg-[var(--color-surface)] text-[14px]"
                disabled={disabled}
                isHighlighted={isHighlighted}
                key={column}
                onClick={() => onPlaceBet({ kind: "column", column })}
                onHoverHandlers={onGetHoverHandlers({
                  kind: "row",
                  rowIndex: index,
                  numbers: rowNumbers,
                })}
              >
                2:1
              </MobileBetButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
