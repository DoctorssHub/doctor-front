import { create } from "zustand";
import type { Bet } from "@/entities/bet/model/types";
import type { GameMode, Risk } from "@/entities/game/model/types";
import type { ActiveRound } from "@/features/plinko/model/active-round";
import { useLiveBetRevealStore } from "@/shared/model/live-bet-reveal-store";

const MAX_RECENT_MULTIPLIERS = 20;
const ROUND_CLEANUP_DELAY_MS = 1200;

type AddRoundParams = {
  bet: Bet;
  request: {
    mode: GameMode;
    risk: Risk;
    rows: number;
  };
};

type PlinkoRoundsStore = {
  activeRounds: ActiveRound[];
  addRound: (params: AddRoundParams) => void;
  handleRoundAnimationComplete: (roundId: string) => void;
  recentMultipliers: number[];
  resetRounds: () => void;
};

const initialRecentMultipliers: number[] = [];
const cleanupTimeoutIds = new Set<number>();
const historyRoundIds = new Set<string>();
const roundById = new Map<string, ActiveRound>();

function clearRoundCleanupTimeouts() {
  cleanupTimeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
  cleanupTimeoutIds.clear();
}

export const usePlinkoRoundsStore = create<PlinkoRoundsStore>((set) => ({
  activeRounds: [],
  addRound: ({ bet, request }) => {
    const activeRound = {
      bet,
      id: bet.betId,
      isResultVisible: false,
      mode: request.mode,
      risk: request.risk,
      rows: request.rows,
    };

    roundById.set(activeRound.id, activeRound);
    set((state) => ({
      activeRounds: [...state.activeRounds, activeRound],
    }));
  },
  handleRoundAnimationComplete: (roundId) => {
    const completedRound = roundById.get(roundId);

    if (completedRound && !historyRoundIds.has(roundId)) {
      historyRoundIds.add(roundId);
      set((state) => ({
        recentMultipliers: [
          completedRound.bet.multiplier,
          ...state.recentMultipliers,
        ].slice(0, MAX_RECENT_MULTIPLIERS),
      }));
    }

    set((state) => ({
      activeRounds: state.activeRounds.map((round) =>
        round.id === roundId ? { ...round, isResultVisible: true } : round,
      ),
    }));

    // The result is now visible to the user, so the live feed may show this bet.
    useLiveBetRevealStore.getState().markBetRevealed(roundId);

    const timeoutId = window.setTimeout(() => {
      cleanupTimeoutIds.delete(timeoutId);
      roundById.delete(roundId);
      set((state) => ({
        activeRounds: state.activeRounds.filter((round) => round.id !== roundId),
      }));
    }, ROUND_CLEANUP_DELAY_MS);

    cleanupTimeoutIds.add(timeoutId);
  },
  recentMultipliers: [...initialRecentMultipliers],
  resetRounds: () => {
    clearRoundCleanupTimeouts();
    historyRoundIds.clear();
    roundById.clear();
    useLiveBetRevealStore.getState().reset();
    set({
      activeRounds: [],
      recentMultipliers: [...initialRecentMultipliers],
    });
  },
}));
