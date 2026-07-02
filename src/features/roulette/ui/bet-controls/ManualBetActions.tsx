import Image from "next/image";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import clearIconDesk from "@/assets/games/roulette/clearIconDesk.svg";
import undoIconDesk from "@/assets/games/roulette/undoIconDesk.svg";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { useRouletteStore } from "../../model/use-roulette-store";

type ManualBetActionsProps = {
  disabled: boolean;
  isVisible: boolean;
};

export const ManualBetActions = memo(function ManualBetActions({
  disabled,
  isVisible,
}: ManualBetActionsProps) {
  const { canUndo, clearBets, undoBet } = useRouletteStore(
    useShallow((state) => ({
      canUndo: state.placedBets.length > 0,
      clearBets: state.clearBets,
      undoBet: state.undoBet,
    })),
  );

  function handleClear() {
    gameSounds.playClear();
    clearBets();
  }

  function handleUndo() {
    gameSounds.playChipPlacement("straight");
    undoBet();
  }

  return (
    <div
      className={[
        "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out max-laptop:hidden",
        isVisible
          ? "max-h-[120px] translate-y-0 opacity-100"
          : "max-h-0 -translate-y-2 opacity-0",
      ].join(" ")}
    >
      <p className="text-[18px] font-medium leading-[133%] text-[var(--color-text-primary)]">
        Choose action
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-roulette-action-button)] text-[18px] font-medium leading-[133%] text-[var(--color-text-primary)] transition hover:brightness-110 disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={handleClear}
          type="button"
        >
          <Image alt="" className="h-5 w-5" src={clearIconDesk} />
          Clear
        </button>
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-roulette-action-button)] text-[18px] font-medium leading-[133%] text-[var(--color-text-primary)] transition hover:brightness-110 disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={handleUndo}
          type="button"
        >
          <Image alt="" className="h-5 w-5" src={undoIconDesk} />
          Undo
        </button>
      </div>
    </div>
  );
});
