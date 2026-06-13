import Image from "next/image";
import clearIconDesk from "@/assets/games/roulette/clearIconDesk.svg";
import undoIconDesk from "@/assets/games/roulette/undoIconDesk.svg";

type ManualBetActionsProps = {
  canUndo: boolean;
  disabled: boolean;
  isVisible: boolean;
  onClear: () => void;
  onUndo: () => void;
};

export function ManualBetActions({
  canUndo,
  disabled,
  isVisible,
  onClear,
  onUndo,
}: ManualBetActionsProps) {
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
          onClick={onClear}
          type="button"
        >
          <Image alt="" className="h-5 w-5" src={clearIconDesk} />
          Clear
        </button>
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-roulette-action-button)] text-[18px] font-medium leading-[133%] text-[var(--color-text-primary)] transition hover:brightness-110 disabled:opacity-45"
          disabled={!canUndo || disabled}
          onClick={onUndo}
          type="button"
        >
          <Image alt="" className="h-5 w-5" src={undoIconDesk} />
          Undo
        </button>
      </div>
    </div>
  );
}
