import Image from "next/image";
import { memo, type ReactNode } from "react";

import clearIcon from "@/assets/games/roulette/clearIcon.svg";
import undoIcon from "@/assets/games/roulette/undoIcon.svg";
import type { NewRouletteBet } from "../../model/roulette-bets";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { useRouletteStore } from "../../model/use-roulette-store";
import { lowerButtonClass } from "./betting-board-utils";
import { PlacedChip } from "./PlacedChip";

type BettingOutsideBetsProps = {
  colorBlackAmount?: number;
  colorRedAmount?: number;
  dozenFirstAmount?: number;
  dozenSecondAmount?: number;
  dozenThirdAmount?: number;
  halfHighAmount?: number;
  halfLowAmount?: number;
  parityEvenAmount?: number;
  parityOddAmount?: number;
  disabled: boolean;
  isFullscreen?: boolean;
  onClear: () => void;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onUndo: () => void;
};


type TabletBoardActionsProps = {
  disabled: boolean;
  onClear: () => void;
  onUndo: () => void;
};
type HoverTriggerAttributes = {
  "data-hover-color"?: "RED" | "BLACK";
  "data-hover-dozen"?: "FIRST" | "SECOND" | "THIRD";
  "data-hover-half"?: "LOW" | "HIGH";
  "data-hover-parity"?: "EVEN" | "ODD";
};

const DOZEN_FIRST_BET = { kind: "dozen", dozen: "FIRST" } satisfies NewRouletteBet;
const DOZEN_SECOND_BET = { kind: "dozen", dozen: "SECOND" } satisfies NewRouletteBet;
const DOZEN_THIRD_BET = { kind: "dozen", dozen: "THIRD" } satisfies NewRouletteBet;
const HALF_LOW_BET = { kind: "half", half: "LOW" } satisfies NewRouletteBet;
const HALF_HIGH_BET = { kind: "half", half: "HIGH" } satisfies NewRouletteBet;
const PARITY_EVEN_BET = { kind: "parity", parity: "EVEN" } satisfies NewRouletteBet;
const PARITY_ODD_BET = { kind: "parity", parity: "ODD" } satisfies NewRouletteBet;
const COLOR_RED_BET = { kind: "color", color: "RED" } satisfies NewRouletteBet;
const COLOR_BLACK_BET = { kind: "color", color: "BLACK" } satisfies NewRouletteBet;

const DOZEN_FIRST_HOVER = { "data-hover-dozen": "FIRST" } satisfies HoverTriggerAttributes;
const DOZEN_SECOND_HOVER = { "data-hover-dozen": "SECOND" } satisfies HoverTriggerAttributes;
const DOZEN_THIRD_HOVER = { "data-hover-dozen": "THIRD" } satisfies HoverTriggerAttributes;
const HALF_LOW_HOVER = { "data-hover-half": "LOW" } satisfies HoverTriggerAttributes;
const HALF_HIGH_HOVER = { "data-hover-half": "HIGH" } satisfies HoverTriggerAttributes;
const PARITY_EVEN_HOVER = { "data-hover-parity": "EVEN" } satisfies HoverTriggerAttributes;
const PARITY_ODD_HOVER = { "data-hover-parity": "ODD" } satisfies HoverTriggerAttributes;
const COLOR_RED_HOVER = { "data-hover-color": "RED" } satisfies HoverTriggerAttributes;
const COLOR_BLACK_HOVER = { "data-hover-color": "BLACK" } satisfies HoverTriggerAttributes;
type LowerBetButtonProps = {
  amount?: number;
  ariaLabel?: string;
  backgroundClass: string;
  bet: NewRouletteBet;
  children?: ReactNode;
  disabled: boolean;
  hoverTriggerAttributes: HoverTriggerAttributes;
  onPlaceBet: (bet: NewRouletteBet) => void;
  spanClass: string;
};

const LowerBetButton = memo(function LowerBetButton({
  amount,
  ariaLabel,
  backgroundClass,
  bet,
  children,
  disabled,
  hoverTriggerAttributes,
  onPlaceBet,
  spanClass,
}: LowerBetButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={[
        "roulette-board-trigger",
        lowerButtonClass(backgroundClass, false, spanClass),
      ].join(" ")}
      disabled={disabled}
      {...hoverTriggerAttributes}
      onClick={() => onPlaceBet(bet)}
      type="button"
    >
      {children}
      {amount ? <PlacedChip amount={amount} /> : null}
    </button>
  );
});


const TabletBoardActions = memo(function TabletBoardActions({
  disabled,
  onClear,
  onUndo,
}: TabletBoardActionsProps) {
  const canUndo = useRouletteStore((state) => state.placedBets.length > 0);

  return (
    <>
      <button
        aria-label="Clear"
        className="hidden h-12 w-12 place-items-center rounded-[4px] border border-[var(--color-surface-icon)] bg-[image:var(--gradient-roulette-action-button)] p-3 transition hover:brightness-110 disabled:opacity-45 tablet:max-laptop:grid"
        disabled={!canUndo || disabled}
        onClick={onClear}
        type="button"
      >
        <Image alt="" className="h-5 w-5" src={clearIcon} />
      </button>
      <button
        aria-label="Undo"
        className="hidden h-12 w-12 place-items-center rounded-[4px] border border-[var(--color-surface-icon)] bg-[image:var(--gradient-roulette-action-button)] p-3 transition hover:brightness-110 disabled:opacity-45 tablet:max-laptop:grid"
        disabled={!canUndo || disabled}
        onClick={onUndo}
        type="button"
      >
        <Image alt="" className="h-5 w-5" src={undoIcon} />
      </button>
    </>
  );
});
export const BettingOutsideBets = memo(function BettingOutsideBets({
  colorBlackAmount,
  colorRedAmount,
  dozenFirstAmount,
  dozenSecondAmount,
  dozenThirdAmount,
  halfHighAmount,
  halfLowAmount,
  parityEvenAmount,
  parityOddAmount,
  disabled,
  isFullscreen = false,
  onClear,
  onPlaceBet,
  onUndo,
}: BettingOutsideBetsProps) {
  const isTabletBoardActionsViewport = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)",
  );

  return (
    <div>
      <div
        className={[
          "mt-[5px] grid grid-cols-3 gap-[5px]",
          isFullscreen ? "w-full" : "w-[625px] tablet:max-laptop:w-[709px]",
        ].join(" ")}
      >
        <LowerBetButton
          amount={dozenFirstAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={DOZEN_FIRST_BET}
          disabled={disabled}
          hoverTriggerAttributes={DOZEN_FIRST_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass=""
        >
          1 to 12
        </LowerBetButton>
        <LowerBetButton
          amount={dozenSecondAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={DOZEN_SECOND_BET}
          disabled={disabled}
          hoverTriggerAttributes={DOZEN_SECOND_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass=""
        >
          13 to 24
        </LowerBetButton>
        <LowerBetButton
          amount={dozenThirdAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={DOZEN_THIRD_BET}
          disabled={disabled}
          hoverTriggerAttributes={DOZEN_THIRD_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass=""
        >
          25 to 36
        </LowerBetButton>
      </div>

      <div
        className={[
          "mt-[5px] grid grid-cols-6 gap-[5px]",
          isFullscreen
            ? "w-full"
            : "w-[625px] tablet:max-laptop:w-[709px] tablet:max-laptop:grid-cols-[1fr_1fr_1fr_1fr_50px_73px_48px_48px]",
        ].join(" ")}
      >
        <LowerBetButton
          amount={halfLowAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={HALF_LOW_BET}
          disabled={disabled}
          hoverTriggerAttributes={HALF_LOW_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-full"}
        >
          1 to 18
        </LowerBetButton>
        <LowerBetButton
          amount={parityEvenAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={PARITY_EVEN_BET}
          disabled={disabled}
          hoverTriggerAttributes={PARITY_EVEN_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-full"}
        >
          Even
        </LowerBetButton>
        <LowerBetButton
          amount={colorRedAmount}
          ariaLabel="Red"
          backgroundClass="bg-[var(--color-roulette-red)]"
          bet={COLOR_RED_BET}
          disabled={disabled}
          hoverTriggerAttributes={COLOR_RED_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-full"}
        />
        <LowerBetButton
          amount={colorBlackAmount}
          ariaLabel="Black"
          backgroundClass="bg-[image:var(--gradient-roulette-dark-cell)]"
          bet={COLOR_BLACK_BET}
          disabled={disabled}
          hoverTriggerAttributes={COLOR_BLACK_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-full"}
        />
        <LowerBetButton
          amount={parityOddAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={PARITY_ODD_BET}
          disabled={disabled}
          hoverTriggerAttributes={PARITY_ODD_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-[50px]"}
        >
          Odd
        </LowerBetButton>
        <LowerBetButton
          amount={halfHighAmount}
          backgroundClass="bg-[var(--color-surface)]"
          bet={HALF_HIGH_BET}
          disabled={disabled}
          hoverTriggerAttributes={HALF_HIGH_HOVER}
          onPlaceBet={onPlaceBet}
          spanClass={isFullscreen ? "" : "w-[100px] tablet:max-laptop:w-[73px]"}
        >
          19 to 36
        </LowerBetButton>
        {isTabletBoardActionsViewport ? (
          <TabletBoardActions
            disabled={disabled}
            onClear={onClear}
            onUndo={onUndo}
          />
        ) : null}

      </div>
    </div>
  );
});
