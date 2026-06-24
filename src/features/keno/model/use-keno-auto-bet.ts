import { useCallback, useRef } from "react";
import { delay } from "../lib/keno-delay";
import { validateKenoAutoBet } from "../lib/keno-auto-bet-validation";
import { useKenoBettingStore } from "./keno-betting-store";
import type { KenoRisk } from "./keno-controls-store";

const AUTO_BET_DELAY_MS = 1900;

export type KenoBetRound = {
  betSize: string;
  risk: KenoRisk;
  selectedNumbers: number[];
};

type UseKenoAutoBetParams = {
  autoBetsAmount: string;
  gameBalance: number;
  isAutoBetsInfinite: boolean;
  parsedBetAmount: number;
  runKenoBet: (round: KenoBetRound) => Promise<void>;
  setLocalErrorMessage: (message: string | null) => void;
  waitForRevealComplete: () => Promise<void>;
};

export function useKenoAutoBet({
  autoBetsAmount,
  gameBalance,
  isAutoBetsInfinite,
  parsedBetAmount,
  runKenoBet,
  setLocalErrorMessage,
  waitForRevealComplete,
}: UseKenoAutoBetParams) {
  const shouldStopAutoBetRef = useRef(false);

  const requestStop = useCallback(() => {
    shouldStopAutoBetRef.current = true;
    useKenoBettingStore.getState().requestAutoBetStop();
  }, []);

  const runAutoBet = useCallback(
    async (round: KenoBetRound) => {
      const validationError = validateKenoAutoBet({
        autoBetsAmount,
        gameBalance,
        isAutoBetsInfinite,
        parsedBetAmount,
      });

      if (validationError) {
        setLocalErrorMessage(validationError);
        return;
      }

      const autoBetsCount = Number(autoBetsAmount);
      const { setAutoBetStopRequested, setAutoBetting } =
        useKenoBettingStore.getState();

      shouldStopAutoBetRef.current = false;
      setAutoBetting(true);
      setAutoBetStopRequested(false);

      try {
        let index = 0;

        while (isAutoBetsInfinite || index < autoBetsCount) {
          if (shouldStopAutoBetRef.current) {
            break;
          }

          await runKenoBet(round);
          await waitForRevealComplete();

          if (shouldStopAutoBetRef.current) {
            break;
          }

          index += 1;

          if (isAutoBetsInfinite || index < autoBetsCount) {
            await delay(AUTO_BET_DELAY_MS);
          }
        }
      } catch {
        setLocalErrorMessage(
          "Autobet stopped. Balance may be too low or the bet was rejected.",
        );
      } finally {
        shouldStopAutoBetRef.current = false;
        setAutoBetting(false);
        setAutoBetStopRequested(false);
      }
    },
    [
      autoBetsAmount,
      gameBalance,
      isAutoBetsInfinite,
      parsedBetAmount,
      runKenoBet,
      setLocalErrorMessage,
      waitForRevealComplete,
    ],
  );

  return {
    requestStop,
    runAutoBet,
  };
}
