import type {
  NewRouletteBet,
  PlacedRouletteBet,
} from "../../model/roulette-bets";
import { ROULETTE_RED_NUMBERS } from "../../model/roulette-constants";
import type { HoverArea } from "./betting-board-types";

export function getNumberBackgroundClass(number: number) {
  if (number === 0) {
    return "bg-[var(--color-roulette-green)]";
  }

  if (ROULETTE_RED_NUMBERS.has(number)) {
    return "bg-[var(--color-roulette-red)]";
  }

  return "bg-[image:var(--gradient-roulette-dark-cell)]";
}

export function getStateClass(isHighlighted: boolean, isDimmed: boolean) {
  if (isHighlighted) {
    return "border-[var(--color-roulette-highlight-border)] brightness-110 shadow-[var(--shadow-roulette-highlight)]";
  }

  if (isDimmed) {
    return "border-transparent opacity-75 brightness-[0.82]";
  }

  return "hover:border-white/55 hover:brightness-110";
}

export function numberButtonClass(
  number: number,
  isHighlighted: boolean,
  isDimmed: boolean,
) {
  return [
    "relative flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-transparent text-center text-[14px] font-semibold leading-[129%] text-[var(--color-text-primary)] transition duration-150 disabled:opacity-60 tablet:max-laptop:h-[46px] tablet:max-laptop:w-[46px]",
    getNumberBackgroundClass(number),
    getStateClass(isHighlighted, isDimmed),
  ].join(" ");
}

export function controlButtonClass(
  isHighlighted: boolean,
  isDimmed: boolean,
) {
  return [
    "relative flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border text-center text-[14px] font-semibold leading-[129%] text-[var(--color-text-primary)] transition duration-150 disabled:opacity-60 tablet:max-laptop:h-[46px] tablet:max-laptop:w-[46px]",
    "bg-[var(--color-surface)]",
    isHighlighted || isDimmed
      ? getStateClass(isHighlighted, isDimmed)
      : "border-[var(--color-roulette-soft-border)] hover:border-[var(--color-roulette-highlight-border)] hover:brightness-110",
  ].join(" ");
}

export function lowerButtonClass(
  backgroundClass: string,
  isHighlighted: boolean,
  spanClass: string,
) {
  return [
    "relative flex h-[46px] items-center justify-center rounded-[4px] border border-[var(--color-roulette-soft-border)] px-[9px] py-[14px] text-center text-[14px] font-semibold leading-[129%] text-[var(--color-text-primary)] transition duration-150 disabled:opacity-60",
    backgroundClass,
    isHighlighted
      ? "border-[var(--color-roulette-highlight-border)] brightness-110 shadow-[var(--shadow-roulette-highlight)]"
      : "hover:border-[var(--color-roulette-highlight-border)] hover:brightness-110",
    spanClass,
  ].join(" ");
}

export function getBetKey(bet: NewRouletteBet) {
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

export function buildBetAmountMap(bets: PlacedRouletteBet[]) {
  return bets.reduce((amounts, bet) => {
    const key = getBetKey(bet);

    amounts.set(key, (amounts.get(key) ?? 0) + bet.amount);

    return amounts;
  }, new Map<string, number>());
}

export function isNumberInHoverArea(
  number: number,
  hoverArea: HoverArea | null,
) {
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
