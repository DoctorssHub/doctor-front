"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { AutoBetControls } from "@/widgets/game-sidebar/ui/AutoBetControls";
import { useIsPlinkoStakeChangeDisabled } from "../../model/usePlinkoSidebarDisabledState";

export function PlinkoAutoBetSection() {
  const {
    autoBetsAmount,
    isAutoBetsInfinite,
    mode,
    setAutoBetsAmount,
    toggleAutoBetsInfinite,
  } = usePlinkoControlsStore(
    useShallow((state) => ({
      autoBetsAmount: state.autoBetsAmount,
      isAutoBetsInfinite: state.isAutoBetsInfinite,
      mode: state.mode,
      setAutoBetsAmount: state.setAutoBetsAmount,
      toggleAutoBetsInfinite: state.toggleAutoBetsInfinite,
    })),
  );
  const isDisabled = useIsPlinkoStakeChangeDisabled();

  if (mode !== "Auto") {
    return null;
  }

  return (
    <AutoBetControls
      autoBetsAmount={autoBetsAmount}
      isAutoBetsInfinite={isAutoBetsInfinite}
      isDisabled={isDisabled}
      onAutoBetsAmountChange={setAutoBetsAmount}
      onAutoBetsInfinityToggle={toggleAutoBetsInfinite}
    />
  );
}
