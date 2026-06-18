import { create } from "zustand";

const MAX_REVEALED_TRACKED = 200;

// Tracks locally-played bets whose result has been shown to the user. The live
// bet feed uses this to defer inserting the user's own bet until the game result
// is revealed (e.g. the Plinko ball has landed), so the table never spoils it.
type LiveBetRevealStore = {
  revealedBetIds: string[];
  lastRevealedBetId: string | null;
  markBetRevealed: (betId: string) => void;
  reset: () => void;
};

export const useLiveBetRevealStore = create<LiveBetRevealStore>((set) => ({
  revealedBetIds: [],
  lastRevealedBetId: null,
  markBetRevealed: (betId) =>
    set((state) => ({
      revealedBetIds: [betId, ...state.revealedBetIds].slice(
        0,
        MAX_REVEALED_TRACKED,
      ),
      lastRevealedBetId: betId,
    })),
  reset: () => set({ revealedBetIds: [], lastRevealedBetId: null }),
}));
