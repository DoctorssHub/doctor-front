"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlinkoControlsStore } from "@/features/plinko/model/plinko-controls-store";
import { RowsSlider } from "@/widgets/game-sidebar/ui/RowsSlider";
import { useIsPlinkoGameControlDisabled } from "../../model/usePlinkoSidebarDisabledState";

export function PlinkoRowsControl() {
  const { rows, setRows } = usePlinkoControlsStore(
    useShallow((state) => ({
      rows: state.rows,
      setRows: state.setRows,
    })),
  );
  const isDisabled = useIsPlinkoGameControlDisabled();

  return (
    <RowsSlider
      isDisabled={isDisabled}
      onChange={setRows}
      value={rows}
    />
  );
}
