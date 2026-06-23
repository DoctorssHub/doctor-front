import { useCallback, useState } from "react";
import type { KenoBetResponse } from "../api/keno-types";

export function useKenoRoundState() {
  const [lastBetResult, setLastBetResult] = useState<KenoBetResponse | null>(
    null,
  );
  const [resultNumbers, setResultNumbers] = useState<number[]>([]);
  const [roundSelectedNumbers, setRoundSelectedNumbers] = useState<number[]>(
    [],
  );
  const [resultRoundId, setResultRoundId] = useState(0);
  const [isRevealingResults, setIsRevealingResults] = useState(false);
  const resultHitCount = roundSelectedNumbers.filter((number) =>
    resultNumbers.includes(number),
  ).length;

  const beginRound = useCallback((selectedNumbers: number[]) => {
    setLastBetResult(null);
    setResultNumbers([]);
    setRoundSelectedNumbers([...selectedNumbers]);
    setResultRoundId((currentRoundId) => currentRoundId + 1);
    setIsRevealingResults(false);
  }, []);

  const setRoundResult = useCallback((result: KenoBetResponse) => {
    setLastBetResult(result);
    setResultNumbers(result.results.map((number) => number + 1));
    setIsRevealingResults(true);
  }, []);

  const completeReveal = useCallback(() => {
    setIsRevealingResults(false);
  }, []);

  const resetRound = useCallback(() => {
    setLastBetResult(null);
    setResultNumbers([]);
    setRoundSelectedNumbers([]);
    setResultRoundId((currentRoundId) => currentRoundId + 1);
  }, []);

  return {
    beginRound,
    completeReveal,
    isRevealingResults,
    lastBetResult,
    resetRound,
    resultHitCount,
    resultNumbers,
    resultRoundId,
    roundSelectedNumbers,
    setRoundResult,
  };
}
