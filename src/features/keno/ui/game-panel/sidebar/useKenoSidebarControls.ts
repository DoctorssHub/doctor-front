import { useShallow } from "zustand/react/shallow";
import { useKenoControlsStore } from "../../../model/keno-controls-store";

export function useKenoSidebarControls() {
  return useKenoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      betAmount: state.betAmount,
      hasSelectedNumbers: state.selectedNumbers.length > 0,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      mode: state.mode,
      risk: state.risk,
      setAutoBetsAmount: state.setAutoBetsAmount,
      setBetAmount: state.setBetAmount,
      setMode: state.setMode,
      setRisk: state.setRisk,
      toggleAutoBetsInfinite: state.toggleAutoBetsInfinite,
    })),
  );
}