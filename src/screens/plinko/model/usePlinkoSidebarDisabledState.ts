"use client";

import { useShallow } from "zustand/react/shallow";
import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import { usePlinkoRoundsStore } from "@/features/plinko/model/plinko-rounds-store";

export function useIsPlinkoGameControlDisabled() {
  const isAutoBetting = usePlinkoBettingStore(
    (state) => state.isAutoBetting,
  );
  const isRoundInFlight = usePlinkoRoundsStore(
    (state) => state.activeRounds.length > 0,
  );

  return isAutoBetting || isRoundInFlight;
}

export function useIsPlinkoStakeChangeDisabled() {
  const { isAutoBetting, isBetting } = usePlinkoBettingStore(
    useShallow((state) => ({
      isAutoBetting: state.isAutoBetting,
      isBetting: state.isBetting,
    })),
  );
  const isRoundInFlight = usePlinkoRoundsStore(
    (state) => state.activeRounds.length > 0,
  );

  return isAutoBetting || isBetting || isRoundInFlight;
}
