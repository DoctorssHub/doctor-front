import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { KENO_MAX_SELECTION } from "../../../model/keno-constants";
import { useKenoControlsStore } from "../../../model/keno-controls-store";

type KenoActionButtonsProps = {
  isInteractionLocked: boolean;
  onResultsReset: () => void;
};

export const KenoActionButtons = memo(function KenoActionButtons({
  isInteractionLocked,
  onResultsReset,
}: KenoActionButtonsProps) {
  const {
    autoPickNumbers,
    canAutoPick,
    clearNumbers,
    hasSelectedNumbers,
    isAutoPicking,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoPickNumbers: state.autoPickNumbers,
      canAutoPick: state.selectedNumbers.length < KENO_MAX_SELECTION,
      clearNumbers: state.clearNumbers,
      hasSelectedNumbers: state.selectedNumbers.length > 0,
      isAutoPicking: state.isAutoPicking,
    })),
  );
  const handleAutoPick = useCallback(() => {
    void autoPickNumbers();
  }, [autoPickNumbers]);
  const handleClearTable = useCallback(() => {
    clearNumbers();
    onResultsReset();
  }, [clearNumbers, onResultsReset]);

  return (
    <div className="mt-8 grid grid-cols-2 gap-2 max-[1023px]:order-2 max-[1023px]:mt-2">
      <button
        className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white/70 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:text-white/30"
        disabled={isAutoPicking || isInteractionLocked || !hasSelectedNumbers}
        onClick={handleClearTable}
        type="button"
      >
        Clear Table
      </button>
      <button
        className="h-12 rounded-md bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-wait disabled:text-white/40"
        disabled={isAutoPicking || isInteractionLocked || !canAutoPick}
        onClick={handleAutoPick}
        type="button"
      >
        Auto Pick
      </button>
    </div>
  );
});
