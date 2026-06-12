"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";
import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
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
import {
  type BetAmountControl,
  formatBetAmountInput,
  getNextBetAmount,
  readBetAmount,
} from "@/widgets/game-sidebar/lib/bet-amount-controls";
import {
  getBetButtonLabel,
  validateFiniteAutoBetBudget,
} from "../lib/plinko-controls";

const MAX_AUTO_BETS = 100;
const AUTO_BET_DELAY_MS = 500;
const FALLBACK_GAME_POINTS_BALANCE_TYPE = "GAME_POINTS";

export function PlinkoScreen() {
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const balances = useAuthSessionStore((state) => state.balances);
  const gamePointsBalance = findGamePointsBalance(balances);
  const gamePointsBalanceType =
    gamePointsBalance?.balanceType || FALLBACK_GAME_POINTS_BALANCE_TYPE;
  const availableBalance = readNumericValue(gamePointsBalance?.value);
  const [mode, setMode] = useState<GameMode>("Manual");
  const [risk, setRisk] = useState<Risk>("MEDIUM");
  const [rows, setRows] = useState(8);
  const [betAmount, setBetAmount] = useState("1.00");
  const [autoBetsAmount, setAutoBetsAmount] = useState("2");
  const [isAutoBetsInfinite, setIsAutoBetsInfinite] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isAutoBetting, setIsAutoBetting] = useState(false);
  const [isAutoBetStopRequested, setIsAutoBetStopRequested] = useState(false);
  const [activeRounds, setActiveRounds] = useState<ActiveRound[]>([]);
  const [recentMultipliers, setRecentMultipliers] = useState([5.6, 0.5, 1]);
  const [betValidationError, setBetValidationError] = useState("");
  const roundByIdRef = useRef(new Map<string, ActiveRound>());
  const historyRoundIdsRef = useRef(new Set<string>());
  const shouldStopAutoBetRef = useRef(false);
  const plinkoConfigQuery = useQuery({
    queryKey: ["plinko", "config"],
    queryFn: getPlinkoConfig,
  });
  const plinkoConfig = readPlinkoConfig(
    plinkoConfigQuery.data,
    mockGameConfig,
  );
  const isGameConfigReady = plinkoConfigQuery.isSuccess;
  const isGameConfigLoading = plinkoConfigQuery.isPending;
  const hasGameConfigError = plinkoConfigQuery.isError;
  const isRoundInFlight = activeRounds.length > 0;
  const isGameControlDisabled = isAutoBetting || isRoundInFlight;
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
      const activeRound = {
        bet,
        id: bet.betId,
        isResultVisible: false,
        mode: request.mode,
        risk: request.risk,
        rows: request.rows,
      };

      roundByIdRef.current.set(activeRound.id, activeRound);
      setActiveRounds((currentRounds) => [...currentRounds, activeRound]);
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

  const handleBetAmountControlClick = useCallback(
    (control: BetAmountControl) => {
      setBetAmount((currentAmount) =>
        getNextBetAmount(currentAmount, control, {
          availableBalance,
          maxBet: plinkoConfig.maxBet,
          minBet: plinkoConfig.minBet,
        }),
      );
      setBetValidationError("");
    },
    [availableBalance, plinkoConfig.maxBet, plinkoConfig.minBet],
  );
  const handleBetAmountBlur = useCallback(() => {
    setBetAmount((currentAmount) => formatBetAmountInput(currentAmount));
  }, []);

  const validateBetAmount = useCallback(() => {
    const amount = readBetAmount(betAmount);
    const minBet = Number(plinkoConfig.minBet);
    const maxBet = Number(plinkoConfig.maxBet);

    if (amount === null) {
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

    setBetValidationError("");

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!isGameConfigReady) {
      setBetValidationError("Game settings are not loaded yet.");
      return;
    }

    const amountError = validateBetAmount();

    if (amountError) {
      setBetValidationError(amountError);
      return;
    }

    const amount = readBetAmount(betAmount);

    if (amount === null) {
      setBetValidationError("Enter a valid bet amount.");
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

    if (!isAutoBetsInfinite) {
      const budgetError = validateFiniteAutoBetBudget({
        amount,
        autoBetsCount,
        availableBalance,
      });

      if (budgetError) {
        setBetValidationError(budgetError);
        return;
      }
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
      setBetValidationError(
        "Autobet stopped. Balance may be too low or the bet was rejected.",
      );
    } finally {
      shouldStopAutoBetRef.current = false;
      setIsAutoBetting(false);
      setIsAutoBetStopRequested(false);
    }
  }, [
    autoBetsAmount,
    availableBalance,
    betAmount,
    gamePointsBalanceType,
    isAutoBetsInfinite,
    isAutoBetting,
    isGameConfigReady,
    isAuthenticated,
    mode,
    openAuthModal,
    risk,
    rows,
    runPlinkoBet,
    validateBetAmount,
  ]);

  const handleRoundAnimationComplete = useCallback((roundId: string) => {
    const completedRound = roundByIdRef.current.get(roundId);

    if (completedRound && !historyRoundIdsRef.current.has(roundId)) {
      historyRoundIdsRef.current.add(roundId);
      setRecentMultipliers((currentMultipliers) => [
        completedRound.bet.multiplier,
        ...currentMultipliers,
      ]);
    }

    setActiveRounds((currentRounds) =>
      currentRounds.map((round) =>
        round.id === roundId ? { ...round, isResultVisible: true } : round,
      ),
    );

    window.setTimeout(() => {
      roundByIdRef.current.delete(roundId);
      setActiveRounds((currentRounds) =>
        currentRounds.filter((round) => round.id !== roundId),
      );
    }, 1200);
  }, []);

  return (
    <main className="bg-[#080c17] p-4 text-white max-[767px]:p-2 md:p-5">
      <section className="mx-auto flex min-h-[524px] max-w-[60rem] flex-col overflow-hidden rounded-xl border border-[#111827] bg-[#0c111d] shadow-[0_24px_80px_rgb(0_0_0_/_28%)] min-[1024px]:flex-row max-[1023px]:min-h-0">
        <GameSidebar
          autoBetsAmount={autoBetsAmount}
          balanceLabel={gamePointsBalance?.value}
          betAmount={betAmount}
          betButtonLabel={getBetButtonLabel({
            hasConfigError: hasGameConfigError,
            isAuthenticated,
            isAutoBetStopRequested,
            isAutoBetting,
            isBetting,
            isConfigLoading: isGameConfigLoading,
            mode,
          })}
          errorMessage={
            betValidationError ||
            (plinkoConfigQuery.error instanceof Error
              ? "Unable to load game settings. Please try again."
              : undefined)
          }
          isBetDisabled={
            isBetting ||
            (isAuthenticated && (isGameConfigLoading || hasGameConfigError))
          }
          isAutoBetsInfinite={isAutoBetsInfinite}
          isModeChangeDisabled={isGameControlDisabled}
          isRiskChangeDisabled={isGameControlDisabled}
          isRowsChangeDisabled={isGameControlDisabled}
          maxBet={plinkoConfig.maxBet}
          minBet={plinkoConfig.minBet}
          mode={mode}
          onAutoBetsAmountChange={setAutoBetsAmount}
          onAutoBetsInfinityToggle={() =>
            setIsAutoBetsInfinite((current) => !current)
          }
          onBetAmountChange={setBetAmount}
          onBetAmountBlur={handleBetAmountBlur}
          onBetAmountControlClick={handleBetAmountControlClick}
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
