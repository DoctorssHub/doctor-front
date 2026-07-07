import { useEffect, useState } from "react";
import { gameSounds } from "@/shared/lib/sound/use-game-sounds";
import { KENO_NUMBERS } from "../../../model/keno-constants";

const RESULT_REVEAL_DELAY_MS = 120;
const RESULT_REVEAL_COMPLETE_DELAY_MS = 220;

type RevealedNumbersState = {
  missNumbers: number[];
  resultNumbers: number[];
  roundId: number;
};

type CreateKenoRevealStateParams = {
  resultNumbers: number[];
  resultRoundId: number;
  roundSelectedNumbers: number[];
};

type UseKenoRevealSequenceParams = CreateKenoRevealStateParams & {
  isTurboModeEnabled: boolean;
  onRevealComplete: () => void;
};

export function useKenoRevealSequence({
  isTurboModeEnabled,
  onRevealComplete,
  resultNumbers,
  resultRoundId,
  roundSelectedNumbers,
}: UseKenoRevealSequenceParams) {
  const [revealedNumbers, setRevealedNumbers] = useState<RevealedNumbersState>(
    () => createEmptyRevealState(resultRoundId),
  );

  useEffect(() => {
    if (resultNumbers.length === 0) {
      return;
    }

    const revealNumbers = getKenoRevealNumbers({
      resultNumbers,
      roundSelectedNumbers,
    });

    if (isTurboModeEnabled) {
      let completeTimeoutId: ReturnType<typeof setTimeout> | undefined;
      const timeoutId = setTimeout(() => {
        setRevealedNumbers(
          createKenoRevealState({
            resultNumbers,
            resultRoundId,
            roundSelectedNumbers,
          }),
        );
        completeTimeoutId = setTimeout(onRevealComplete, 0);
      }, 0);

      return () => {
        clearTimeout(timeoutId);

        if (completeTimeoutId !== undefined) {
          clearTimeout(completeTimeoutId);
        }
      };
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let revealIndex = 0;

    function revealNextNumber() {
      const nextNumber = revealNumbers[revealIndex];
      const isResultNumber = resultNumbers.includes(nextNumber);
      const isMatchNumber = isResultNumber && roundSelectedNumbers.includes(nextNumber);

      if (isMatchNumber) {
        gameSounds.playMatch();
      } else if (isResultNumber) {
        gameSounds.playReveal();
      } else {
        gameSounds.playImpact();
      }

      setRevealedNumbers((current) =>
        appendRevealedNumber({
          current,
          isResultNumber,
          nextNumber,
          resultRoundId,
        }),
      );

      revealIndex += 1;

      if (revealIndex < revealNumbers.length) {
        timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);
        return;
      }

      timeoutId = setTimeout(onRevealComplete, RESULT_REVEAL_COMPLETE_DELAY_MS);
    }

    timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [
    isTurboModeEnabled,
    onRevealComplete,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
  ]);

  if (revealedNumbers.roundId !== resultRoundId) {
    return {
      revealedMissNumbers: [],
      revealedResultNumbers: [],
    };
  }

  return {
    revealedMissNumbers: revealedNumbers.missNumbers,
    revealedResultNumbers: revealedNumbers.resultNumbers,
  };
}

function createEmptyRevealState(roundId: number): RevealedNumbersState {
  return {
    missNumbers: [],
    resultNumbers: [],
    roundId,
  };
}

function createKenoRevealState({
  resultNumbers,
  resultRoundId,
  roundSelectedNumbers,
}: CreateKenoRevealStateParams): RevealedNumbersState {
  return {
    missNumbers: roundSelectedNumbers.filter(
      (number) => !resultNumbers.includes(number),
    ),
    resultNumbers,
    roundId: resultRoundId,
  };
}

function getKenoRevealNumbers({
  resultNumbers,
  roundSelectedNumbers,
}: Omit<CreateKenoRevealStateParams, "resultRoundId">) {
  return KENO_NUMBERS.filter(
    (number) =>
      resultNumbers.includes(number) ||
      (roundSelectedNumbers.includes(number) &&
        !resultNumbers.includes(number)),
  );
}

type AppendRevealedNumberParams = {
  current: RevealedNumbersState;
  isResultNumber: boolean;
  nextNumber: number;
  resultRoundId: number;
};

function appendRevealedNumber({
  current,
  isResultNumber,
  nextNumber,
  resultRoundId,
}: AppendRevealedNumberParams): RevealedNumbersState {
  const currentMissNumbers = current.roundId === resultRoundId
    ? current.missNumbers
    : [];
  const currentResultNumbers = current.roundId === resultRoundId
    ? current.resultNumbers
    : [];

  return {
    missNumbers: isResultNumber
      ? currentMissNumbers
      : [...currentMissNumbers, nextNumber],
    resultNumbers: isResultNumber
      ? [...currentResultNumbers, nextNumber]
      : currentResultNumbers,
    roundId: resultRoundId,
  };
}
