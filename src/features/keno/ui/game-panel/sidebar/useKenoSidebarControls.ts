import { useShallow } from "zustand/react/shallow";
import { useKenoControlsStore } from "../../../model/keno-controls-store";

export function useKenoSidebarControls(onResultsReset: () => void) {
  const {
    autoBetsAmount,
    autoPickNumbers,
    clearNumbers,
    isAutoBetsInfinite,
    isAutoPicking,
    mode,
    risk,
    selectedNumbersCount,
    setAutoBetsAmount,
    setMode,
    setRisk,
    toggleAutoBetsInfinite,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      autoPickNumbers: state.autoPickNumbers,
      clearNumbers: state.clearNumbers,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      isAutoPicking: state.isAutoPicking,
      mode: state.mode,
      risk: state.risk,
      selectedNumbersCount: state.selectedNumbers.length,
      setAutoBetsAmount: state.setAutoBetsAmount,
      setMode: state.setMode,
      setRisk: state.setRisk,
      toggleAutoBetsInfinite: state.toggleAutoBetsInfinite,
    })),
  );

  function handleClearTable() {
    clearNumbers();
    onResultsReset();
  }

  return {
    autoBetsAmount,
    autoPickNumbers,
    handleClearTable,
    isAutoBetsInfinite,
    isAutoPicking,
    mode,
    risk,
    selectedNumbersCount,
    setAutoBetsAmount,
    setMode,
    setRisk,
    toggleAutoBetsInfinite,
  };
}
