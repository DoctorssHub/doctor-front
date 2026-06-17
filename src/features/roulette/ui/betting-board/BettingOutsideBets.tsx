import Image from "next/image";
import clearIcon from "@/assets/games/roulette/clearIcon.svg";
import undoIcon from "@/assets/games/roulette/undoIcon.svg";
import type { NewRouletteBet } from "../../model/roulette-bets";
import type { HoverArea, HoverHandlers } from "./betting-board-types";
import { lowerButtonClass } from "./betting-board-utils";
import { PlacedChip } from "./PlacedChip";

type BettingOutsideBetsProps = {
  betAmounts: Map<string, number>;
  canUndo: boolean;
  disabled: boolean;
  hoverArea: HoverArea | null;
  onClear: () => void;
  onGetHoverHandlers: (area: HoverArea) => HoverHandlers;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onUndo: () => void;
};

export function BettingOutsideBets({
  betAmounts,
  canUndo,
  disabled,
  hoverArea,
  onClear,
  onGetHoverHandlers,
  onPlaceBet,
  onUndo,
}: BettingOutsideBetsProps) {
  return (
    <div>
      <div className="mt-[5px] grid w-[625px] grid-cols-3 gap-[5px] tablet:max-laptop:w-[709px]">
        <button
          className={lowerButtonClass(
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "range" &&
              hoverArea.min === 1 &&
              hoverArea.max === 12,
            "",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "range", min: 1, max: 12 })}
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
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "range" &&
              hoverArea.min === 13 &&
              hoverArea.max === 24,
            "",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "range", min: 13, max: 24 })}
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
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "range" &&
              hoverArea.min === 25 &&
              hoverArea.max === 36,
            "",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "range", min: 25, max: 36 })}
          onClick={() => onPlaceBet({ kind: "dozen", dozen: "THIRD" })}
          type="button"
        >
          25 to 36
          {betAmounts.has("dozen:THIRD") ? (
            <PlacedChip amount={betAmounts.get("dozen:THIRD") ?? 0} />
          ) : null}
        </button>
      </div>

      <div className="mt-[5px] grid w-[625px] grid-cols-6 gap-[5px] tablet:max-laptop:w-[709px] tablet:max-laptop:grid-cols-[1fr_1fr_1fr_1fr_50px_73px_48px_48px]">
        <button
          className={lowerButtonClass(
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "range" &&
              hoverArea.min === 1 &&
              hoverArea.max === 18,
            "w-[100px] tablet:max-laptop:w-full",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "range", min: 1, max: 18 })}
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
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "parity" && hoverArea.parity === "EVEN",
            "w-[100px] tablet:max-laptop:w-full",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "parity", parity: "EVEN" })}
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
            "bg-[var(--color-roulette-red)]",
            hoverArea?.kind === "color" && hoverArea.color === "RED",
            "w-[100px] tablet:max-laptop:w-full",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "color", color: "RED" })}
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
            "bg-[image:var(--gradient-roulette-dark-cell)]",
            hoverArea?.kind === "color" && hoverArea.color === "BLACK",
            "w-[100px] tablet:max-laptop:w-full",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "color", color: "BLACK" })}
          onClick={() => onPlaceBet({ kind: "color", color: "BLACK" })}
          type="button"
        >
          {betAmounts.has("color:BLACK") ? (
            <PlacedChip amount={betAmounts.get("color:BLACK") ?? 0} />
          ) : null}
        </button>
        <button
          className={lowerButtonClass(
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "parity" && hoverArea.parity === "ODD",
            "w-[100px] tablet:max-laptop:w-[50px]",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "parity", parity: "ODD" })}
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
            "bg-[var(--color-surface)]",
            hoverArea?.kind === "range" &&
              hoverArea.min === 19 &&
              hoverArea.max === 36,
            "w-[100px] tablet:max-laptop:w-[73px]",
          )}
          disabled={disabled}
          {...onGetHoverHandlers({ kind: "range", min: 19, max: 36 })}
          onClick={() => onPlaceBet({ kind: "half", half: "HIGH" })}
          type="button"
        >
          19 to 36
          {betAmounts.has("half:HIGH") ? (
            <PlacedChip amount={betAmounts.get("half:HIGH") ?? 0} />
          ) : null}
        </button>
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
      </div>
    </div>
  );
}
