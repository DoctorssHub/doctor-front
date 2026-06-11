"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";
import { useAuthSessionStore } from "@/features/auth";
import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import {
  getPlinkoConfig,
  placePlinkoBet,
  readPlinkoBet,
  readPlinkoConfig,
} from "@/features/plinko/api/plinko-api";
import { GameSidebar } from "@/widgets/game-sidebar/ui/GameSidebar";
import { PlinkoBoard } from "@/widgets/plinko-board/ui/PlinkoBoard";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";
import { mockGameConfig } from "@/widgets/plinko-board/model/mock-config";

const MAX_AUTO_BETS = 100;
const AUTO_BET_DELAY_MS = 500;
const FALLBACK_GAME_POINTS_BALANCE_TYPE = "GAME_POINTS";

export function PlinkoScreen() {
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const balances = useAuthSessionStore((state) => state.balances);
  const gamePointsBalance = findGamePointsBalance(balances);
  const gamePointsBalanceType =
    gamePointsBalance?.balanceType || FALLBACK_GAME_POINTS_BALANCE_TYPE;
  const availableBalance = readNumericValue(gamePointsBalance?.value);
  const [mode, setMode] = useState<GameMode>("Manual");
  const [risk, setRisk] = useState<Risk>("MEDIUM");
  const [rows, setRows] = useState(8);
  const [betAmount, setBetAmount] = useState("1");
  const [autoBetsAmount, setAutoBetsAmount] = useState("2");
  const [isAutoBetsInfinite, setIsAutoBetsInfinite] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isAutoBetting, setIsAutoBetting] = useState(false);
  const [isAutoBetStopRequested, setIsAutoBetStopRequested] = useState(false);
  const [activeRounds, setActiveRounds] = useState<ActiveRound[]>([]);
  const [recentMultipliers, setRecentMultipliers] = useState([5.6, 0.5, 1]);
  const [betValidationError, setBetValidationError] = useState("");
  const shouldStopAutoBetRef = useRef(false);
  const plinkoConfigQuery = useQuery({
    queryKey: ["plinko", "config"],
    queryFn: getPlinkoConfig,
  });
  const plinkoConfig = readPlinkoConfig(
    plinkoConfigQuery.data,
    mockGameConfig,
  );
  const addRound = useCallback(
    ({
      bet,
      request,
    }: {
      bet: Bet;
      request: {
        mode: GameMode;
        risk: Risk;
        rows: number;
      };
    }) => {
      setActiveRounds((currentRounds) => [
        ...currentRounds,
        {
          bet,
          id: bet.betId,
          isResultVisible: false,
          mode: request.mode,
          risk: request.risk,
          rows: request.rows,
        },
      ]);
    },
    [],
  );
  const runPlinkoBet = useCallback(
    async (request: {
      amount: string;
      balanceType: string;
      mode: GameMode;
      risk: Risk;
      rows: number;
    }) => {
      const bet = readPlinkoBet(await placePlinkoBet(request), request);

      addRound({ bet, request });
    },
    [addRound],
  );

  const validateBetAmount = useCallback(() => {
    const amount = Number(betAmount);
    const minBet = Number(plinkoConfig.minBet);
    const maxBet = Number(plinkoConfig.maxBet);

    if (!Number.isFinite(amount)) {
      return "Enter a valid bet amount.";
    }

    if (Number.isFinite(minBet) && amount < minBet) {
      return `Minimum bet is ${plinkoConfig.minBet}.`;
    }

    if (Number.isFinite(maxBet) && amount > maxBet) {
      return `Maximum bet is ${plinkoConfig.maxBet}.`;
    }

    if (isAuthenticated && availableBalance !== null && amount > availableBalance) {
      return "Not enough balance.";
    }

    return "";
  }, [availableBalance, betAmount, isAuthenticated, plinkoConfig]);

  const handleBetClick = useCallback(async () => {
    if (isAutoBetting) {
      shouldStopAutoBetRef.current = true;
      setIsAutoBetStopRequested(true);
      return;
    }

    const amountError = validateBetAmount();

    setBetValidationError("");

    if (!isAuthenticated) {
      return;
    }

    if (amountError) {
      setBetValidationError(amountError);
      return;
    }

    if (mode === "Manual") {
      setIsBetting(true);

      try {
        await runPlinkoBet({
          amount: betAmount,
          balanceType: gamePointsBalanceType,
          mode,
          risk,
          rows,
        });
      } catch {
        setBetValidationError("Unable to place bet. Please try again.");
      } finally {
        setIsBetting(false);
      }

      return;
    }

    const autoBetsCount = Number(autoBetsAmount);

    if (
      !isAutoBetsInfinite &&
      (!Number.isInteger(autoBetsCount) || autoBetsCount < 1)
    ) {
      setBetValidationError("Number of Bets must be at least 1.");
      return;
    }

    if (!isAutoBetsInfinite && autoBetsCount > MAX_AUTO_BETS) {
      setBetValidationError(`Number of Bets cannot be greater than ${MAX_AUTO_BETS}.`);
      return;
    }

    shouldStopAutoBetRef.current = false;
    setIsAutoBetting(true);
    setIsAutoBetStopRequested(false);

    try {
      let index = 0;

      while (isAutoBetsInfinite || index < autoBetsCount) {
        if (shouldStopAutoBetRef.current) {
          break;
        }

        await runPlinkoBet({
          amount: betAmount,
          balanceType: gamePointsBalanceType,
          mode,
          risk,
          rows,
        });

        if (shouldStopAutoBetRef.current) {
          break;
        }

        index += 1;

        if (isAutoBetsInfinite || index < autoBetsCount) {
          await delay(AUTO_BET_DELAY_MS);
        }
      }
    } catch {
      setBetValidationError("Autobet stopped because a bet failed.");
    } finally {
      shouldStopAutoBetRef.current = false;
      setIsAutoBetting(false);
      setIsAutoBetStopRequested(false);
    }
  }, [
    autoBetsAmount,
    betAmount,
    gamePointsBalanceType,
    isAutoBetsInfinite,
    isAutoBetting,
    isAuthenticated,
    mode,
    risk,
    rows,
    runPlinkoBet,
    validateBetAmount,
  ]);

  const handleRoundAnimationComplete = useCallback((roundId: string) => {
    setActiveRounds((currentRounds) => {
      const completedRound = currentRounds.find(
        (round) => round.id === roundId,
      );

      if (completedRound) {
        setRecentMultipliers((currentMultipliers) => [
          completedRound.bet.multiplier,
          ...currentMultipliers,
        ]);
      }

      return currentRounds.map((round) =>
        round.id === roundId ? { ...round, isResultVisible: true } : round,
      );
    });

    window.setTimeout(() => {
      setActiveRounds((currentRounds) =>
        currentRounds.filter((round) => round.id !== roundId),
      );
    }, 1200);
  }, []);

  return (
    <main className="bg-[#080c17] p-4 text-white md:p-5">
      <section className="mx-auto flex min-h-[640px] max-w-7xl flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0_/_28%)] md:flex-row">
        <GameSidebar
          autoBetsAmount={autoBetsAmount}
          betAmount={betAmount}
          betButtonLabel={
            isAutoBetting
              ? isAutoBetStopRequested
                ? "Stopping..."
                : "Stop Autobet"
              : mode === "Auto"
                ? "Start Autobet"
                : isBetting
                  ? "Betting..."
                  : "Bet"
          }
          errorMessage={
            betValidationError ||
            (plinkoConfigQuery.error instanceof Error
              ? "Unable to load game settings. Please try again."
              : undefined)
          }
          isBetDisabled={isBetting || !isAuthenticated}
          isAutoBetsInfinite={isAutoBetsInfinite}
          isModeChangeDisabled={isAutoBetting}
          maxBet={plinkoConfig.maxBet}
          minBet={plinkoConfig.minBet}
          mode={mode}
          onAutoBetsAmountChange={setAutoBetsAmount}
          onAutoBetsInfinityToggle={() =>
            setIsAutoBetsInfinite((current) => !current)
          }
          onBetAmountChange={setBetAmount}
          onBetClick={handleBetClick}
          onModeChange={setMode}
          onRiskChange={setRisk}
          onRowsChange={setRows}
          risk={risk}
          rows={rows}
        />
        <PlinkoBoard
          activeRounds={activeRounds}
          config={plinkoConfig}
          onRoundAnimationComplete={handleRoundAnimationComplete}
          recentMultipliers={recentMultipliers}
          risk={risk}
          rows={rows}
        />
      </section>
    </main>
  );
}

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function readNumericValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function findGamePointsBalance(balances: UserBalance[]) {
  return balances.find((balance) => isGamePointsBalanceType(balance.balanceType));
}

function isGamePointsBalanceType(balanceType: string) {
  const normalizedBalanceType = balanceType.replace(/[_\s-]+/g, "").toLowerCase();

  return normalizedBalanceType.includes("gamepoint");
}
