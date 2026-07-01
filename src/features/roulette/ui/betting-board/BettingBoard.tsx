"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import type { NewRouletteBet } from "../../model/roulette-bets";
import { useRouletteStore } from "../../model/use-roulette-store";
import { BettingNumberGrid } from "./BettingNumberGrid";
import { BettingOutsideBets } from "./BettingOutsideBets";
import { MobileBettingBoard } from "./mobile-betting-board";
import type { HoverArea } from "./betting-board-types";
import { buildBetAmountMap } from "./betting-board-utils";

type BettingBoardProps = {
  disabled: boolean;
  isFullscreen?: boolean;
};

const DESKTOP_HOVER_TARGET_DATASET_KEYS = [
  "hoverColor",
  "hoverDozen",
  "hoverHalf",
  "hoverNumbers",
  "hoverParity",
  "hoverRow",
] as const;

function clearDesktopHoverTargetAttributes(shell: HTMLElement) {
  for (const key of DESKTOP_HOVER_TARGET_DATASET_KEYS) {
    delete shell.dataset[key];
  }
}

function clearDesktopHoverAttributes(shell: HTMLElement) {
  delete shell.dataset.hoverActive;
  clearDesktopHoverTargetAttributes(shell);
}

function getDesktopHoverTrigger(target: EventTarget | null, shell: HTMLElement) {
  if (!(target instanceof Element)) {
    return null;
  }

  const trigger = target.closest<HTMLElement>(".roulette-board-trigger");

  if (!trigger || !shell.contains(trigger)) {
    return null;
  }

  if (trigger instanceof HTMLButtonElement && trigger.disabled) {
    return null;
  }

  return trigger;
}

function syncDesktopHoverTargetAttributes(
  shell: HTMLElement,
  target: EventTarget | null,
) {
  const trigger = getDesktopHoverTrigger(target, shell);

  if (!trigger) {
    clearDesktopHoverTargetAttributes(shell);
    return;
  }

  const nextHoverColor = trigger.dataset.hoverColor;
  const nextHoverDozen = trigger.dataset.hoverDozen;
  const nextHoverHalf = trigger.dataset.hoverHalf;
  const nextHoverNumbers = trigger.dataset.hoverNumbers;
  const nextHoverParity = trigger.dataset.hoverParity;
  const nextHoverRow = trigger.dataset.hoverRow;

  if (
    shell.dataset.hoverColor === nextHoverColor &&
    shell.dataset.hoverDozen === nextHoverDozen &&
    shell.dataset.hoverHalf === nextHoverHalf &&
    shell.dataset.hoverNumbers === nextHoverNumbers &&
    shell.dataset.hoverParity === nextHoverParity &&
    shell.dataset.hoverRow === nextHoverRow
  ) {
    return;
  }

  clearDesktopHoverTargetAttributes(shell);

  if (nextHoverColor) {
    shell.dataset.hoverColor = nextHoverColor;
  }

  if (nextHoverDozen) {
    shell.dataset.hoverDozen = nextHoverDozen;
  }

  if (nextHoverHalf) {
    shell.dataset.hoverHalf = nextHoverHalf;
  }

  if (nextHoverNumbers) {
    shell.dataset.hoverNumbers = nextHoverNumbers;
  }

  if (nextHoverParity) {
    shell.dataset.hoverParity = nextHoverParity;
  }

  if (nextHoverRow) {
    shell.dataset.hoverRow = nextHoverRow;
  }
}

function areHoverAreasEqual(
  first: HoverArea | null,
  second: HoverArea | null,
) {
  if (first === second) {
    return true;
  }

  if (!first || !second || first.kind !== second.kind) {
    return false;
  }

  if (first.kind === "numbers" && second.kind === "numbers") {
    return first.numbers.length === second.numbers.length &&
      first.numbers.every((number, index) => number === second.numbers[index]);
  }

  if (first.kind === "row" && second.kind === "row") {
    return first.rowIndex === second.rowIndex;
  }

  if (first.kind === "range" && second.kind === "range") {
    return first.min === second.min && first.max === second.max;
  }

  if (first.kind === "parity" && second.kind === "parity") {
    return first.parity === second.parity;
  }

  if (first.kind === "color" && second.kind === "color") {
    return first.color === second.color;
  }

  return false;
}

export function BettingBoard({
  disabled,
  isFullscreen = false,
}: BettingBoardProps) {
  const [mobileHoverArea, setMobileHoverArea] = useState<HoverArea | null>(null);
  const desktopShellRef = useRef<HTMLDivElement>(null);
  const isMobileBoardViewport = useMediaQuery("(max-width: 767px)");
  const placedBets = useRouletteStore((state) => state.placedBets);
  const placeBet = useRouletteStore((state) => state.placeBet);
  const clearBets = useRouletteStore((state) => state.clearBets);
  const undoBet = useRouletteStore((state) => state.undoBet);
  const betAmounts = useMemo(() => buildBetAmountMap(placedBets), [placedBets]);

  const handlePlaceBet = useCallback((bet: NewRouletteBet) => {
    gameSounds.playChipPlacement(
      bet.kind === "straight" ? "straight" : "group",
    );
    placeBet(bet);
  }, [placeBet]);

  const handleClearBets = useCallback(() => {
    gameSounds.playClear();
    clearBets();
  }, [clearBets]);

  const handleUndoBet = useCallback(() => {
    gameSounds.playChipPlacement("straight");
    undoBet();
  }, [undoBet]);
  const setMobileHoverAreaIfChanged = useCallback((area: HoverArea) => {
    setMobileHoverArea((currentArea) =>
      areHoverAreasEqual(currentArea, area) ? currentArea : area,
    );
  }, []);

  useEffect(() => {
    if (disabled && desktopShellRef.current) {
      clearDesktopHoverAttributes(desktopShellRef.current);
    }
  }, [disabled]);

  const getMobileHoverHandlers = useCallback((area: HoverArea) => {
    return {
      onBlur: () => {
        setMobileHoverArea(null);
      },
      onFocus: () => {
        setMobileHoverAreaIfChanged(area);
      },
      onMouseEnter: () => {
        setMobileHoverAreaIfChanged(area);
      },
      onMouseLeave: () => undefined,
    };
  }, [setMobileHoverAreaIfChanged]);

  const handleDesktopPointerEnter = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.dataset.hoverActive = "true";
    syncDesktopHoverTargetAttributes(event.currentTarget, event.target);
  }, []);

  const handleDesktopPointerOver = useCallback((event: PointerEvent<HTMLDivElement>) => {
    syncDesktopHoverTargetAttributes(event.currentTarget, event.target);
  }, []);

  const handleDesktopPointerLeave = useCallback((event: PointerEvent<HTMLDivElement>) => {
    clearDesktopHoverAttributes(event.currentTarget);
  }, []);

  const handleDesktopFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
    event.currentTarget.dataset.hoverActive = "true";
    syncDesktopHoverTargetAttributes(event.currentTarget, event.target);
  }, []);

  const handleDesktopBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearDesktopHoverAttributes(event.currentTarget);
    }
  }, []);

  return (
    <div className="w-full overflow-x-auto max-tablet:overflow-visible">
      <div
        className={[
          "roulette-board-shell mx-auto max-tablet:hidden",
          isFullscreen
            ? "w-full min-w-0 max-w-none"
            : "min-w-[625px] max-w-[625px] tablet:max-laptop:h-[264px] tablet:max-laptop:min-w-[719px] tablet:max-laptop:max-w-[719px]",
        ].join(" ")}
        onBlurCapture={handleDesktopBlur}
        onFocusCapture={handleDesktopFocus}
        onPointerEnter={handleDesktopPointerEnter}
        onPointerLeave={handleDesktopPointerLeave}
        onPointerOver={handleDesktopPointerOver}
      >
        <BettingNumberGrid
          betAmounts={betAmounts}
          disabled={disabled}
          isFullscreen={isFullscreen}
          onPlaceBet={handlePlaceBet}
        />
        <BettingOutsideBets
          colorBlackAmount={betAmounts.get("color:BLACK")}
          colorRedAmount={betAmounts.get("color:RED")}
          dozenFirstAmount={betAmounts.get("dozen:FIRST")}
          dozenSecondAmount={betAmounts.get("dozen:SECOND")}
          dozenThirdAmount={betAmounts.get("dozen:THIRD")}
          halfHighAmount={betAmounts.get("half:HIGH")}
          halfLowAmount={betAmounts.get("half:LOW")}
          parityEvenAmount={betAmounts.get("parity:EVEN")}
          parityOddAmount={betAmounts.get("parity:ODD")}
          disabled={disabled}
          isFullscreen={isFullscreen}
          onClear={handleClearBets}
          onPlaceBet={handlePlaceBet}
          onUndo={handleUndoBet}
        />
      </div>
      {isMobileBoardViewport ? (
        <div onMouseLeave={() => setMobileHoverArea(null)}>
          <MobileBettingBoard
            betAmounts={betAmounts}
            canUndo={placedBets.length > 0}
            disabled={disabled}
            hoverArea={mobileHoverArea}
            onClear={handleClearBets}
            onGetHoverHandlers={getMobileHoverHandlers}
            onPlaceBet={handlePlaceBet}
            onUndo={handleUndoBet}
          />
        </div>
      ) : null}
    </div>
  );
}
