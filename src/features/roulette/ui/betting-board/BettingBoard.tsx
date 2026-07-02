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
import {
  areHoverAreasEqual,
  buildBetAmountMap,
} from "./betting-board-utils";
import {
  clearDesktopHoverAttributes,
  syncDesktopHoverTargetAttributes,
} from "./desktop-hover";

type BettingBoardProps = {
  disabled: boolean;
  isFullscreen?: boolean;
};

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
