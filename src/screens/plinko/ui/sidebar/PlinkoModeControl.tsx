"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { ModeTabs } from "@/widgets/game-sidebar/ui/ModeTabs";
import { useIsPlinkoGameControlDisabled } from "../../model/usePlinkoSidebarDisabledState";

export function PlinkoModeControl() {
  const { mode, setMode } = usePlinkoControlsStore(
    useShallow((state) => ({
      mode: state.mode,
      setMode: state.setMode,
    })),
  );
  const isDisabled = useIsPlinkoGameControlDisabled();

  return <ModeTabs isDisabled={isDisabled} mode={mode} onModeChange={setMode} />;
}
