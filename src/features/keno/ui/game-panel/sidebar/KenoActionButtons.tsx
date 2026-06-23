import { KENO_MAX_SELECTION } from "../../../model/keno-constants";

type KenoActionButtonsProps = {
  isAutoPicking: boolean;
  isInteractionLocked: boolean;
  onAutoPick: () => void;
  onClearTable: () => void;
  selectedNumbersCount: number;
};

export function KenoActionButtons({
  isAutoPicking,
  isInteractionLocked,
  onAutoPick,
  onClearTable,
  selectedNumbersCount,
}: KenoActionButtonsProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-2 max-[1023px]:order-2 max-[1023px]:mt-2">
      <button
        className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white/70 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:text-white/30"
        disabled={
          isAutoPicking || isInteractionLocked || selectedNumbersCount === 0
        }
        onClick={onClearTable}
        type="button"
      >
        Clear Table
      </button>
      <button
        className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-wait disabled:text-white/40"
        disabled={
          isAutoPicking ||
          isInteractionLocked ||
          selectedNumbersCount >= KENO_MAX_SELECTION
        }
        onClick={onAutoPick}
        type="button"
      >
        Auto Pick
      </button>
    </div>
  );
}
