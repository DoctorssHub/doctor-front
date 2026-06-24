import { useEffect, useState } from "react";
import { KENO_NUMBERS } from "../../../model/keno-constants";

const RESULT_REVEAL_DELAY_MS = 120;
const RESULT_REVEAL_COMPLETE_DELAY_MS = 220;

type UseKenoRevealSequenceParams = {
  onRevealComplete: () => void;
  resultNumbers: number[];
  roundSelectedNumbers: number[];
};

export function useKenoRevealSequence({
  onRevealComplete,
  resultNumbers,
  roundSelectedNumbers,
}: UseKenoRevealSequenceParams) {
  const [revealedResultNumbers, setRevealedResultNumbers] = useState<number[]>(
    [],
  );
  const [revealedMissNumbers, setRevealedMissNumbers] = useState<number[]>([]);

  useEffect(() => {
    if (resultNumbers.length === 0) {
      return;
    }

    const revealNumbers = KENO_NUMBERS.filter(
      (number) =>
        resultNumbers.includes(number) ||
        (roundSelectedNumbers.includes(number) &&
          !resultNumbers.includes(number)),
    );
    let timeoutId: ReturnType<typeof setTimeout>;
    let revealIndex = 0;

    function revealNextNumber() {
      const nextNumber = revealNumbers[revealIndex];
      const isResultNumber = resultNumbers.includes(nextNumber);

      if (isResultNumber) {
        setRevealedResultNumbers((currentNumbers) => [
          ...currentNumbers,
          nextNumber,
        ]);
      } else {
        setRevealedMissNumbers((currentNumbers) => [
          ...currentNumbers,
          nextNumber,
        ]);
      }

      revealIndex += 1;

      if (revealIndex < revealNumbers.length) {
        timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);
        return;
      }

      timeoutId = setTimeout(onRevealComplete, RESULT_REVEAL_COMPLETE_DELAY_MS);
    }

    timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [onRevealComplete, resultNumbers, roundSelectedNumbers]);

  return {
    revealedMissNumbers,
    revealedResultNumbers,
  };
}
