"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { RiskSelector } from "@/widgets/game-sidebar/ui/RiskSelector";
import { useIsPlinkoGameControlDisabled } from "../../model/usePlinkoSidebarDisabledState";

export function PlinkoRiskControl() {
  const { risk, setRisk } = usePlinkoControlsStore(
    useShallow((state) => ({
      risk: state.risk,
      setRisk: state.setRisk,
    })),
  );
  const isDisabled = useIsPlinkoGameControlDisabled();

  return (
    <RiskSelector
      isDisabled={isDisabled}
      onRiskChange={setRisk}
      risk={risk}
    />
  );
}
