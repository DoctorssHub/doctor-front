"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBetSocket,
  NEW_LIVE_BET_EVENT,
} from "@/features/bet-history/api/bet-socket";
import {
  mapLiveBetItem,
  type RawLiveBetItem,
} from "@/features/bet-history/api/bet-history-api";
import { useLiveBetRevealStore } from "@/shared/model/live-bet-reveal-store";
import type { BetHistoryQueryParams, BetHistoryResponse } from "./types";

const LIVE_FEED_FALLBACK_SIZE = 10;

// Safety net: if a game never signals a reveal (e.g. it isn't wired into the
// reveal store yet), release a buffered own bet after this delay so it is never
// lost — it just appears a little later instead of being held forever.
const OWN_BET_REVEAL_TIMEOUT_MS = 10000;

// Subscribes the live tables to `NewLiveBet` and prepends incoming bets into the
// cached query so the list updates without a refetch. The user's own bets are
// held back until their result is revealed locally, so the table never spoils
// the outcome of a game still in progress.
export function useLiveBetSocket(
  params: BetHistoryQueryParams,
  enabled: boolean,
  currentUsername: string | null,
) {
  const queryClient = useQueryClient();
  const bufferRef = useRef<Map<string, RawLiveBetItem>>(new Map());
  const timeoutsRef = useRef<Map<string, number>>(new Map());
  const variant = params.variant;
  const category = "category" in params ? params.category : undefined;
  const game = params.variant === "game-live" ? params.game : undefined;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = getBetSocket();
    const buffer = bufferRef.current;
    const timeouts = timeoutsRef.current;

    const insertBet = (raw: RawLiveBetItem) => {
      if (!shouldIncludeLiveBet(raw, params)) {
        return;
      }

      queryClient.setQueryData<BetHistoryResponse>(
        ["bet-history", params],
        (previous) => {
          if (!previous) {
            return previous;
          }

          const item = mapLiveBetItem(raw);
          const cap = previous.items.length || LIVE_FEED_FALLBACK_SIZE;
          const items = [
            item,
            ...previous.items.filter((existing) => existing.id !== item.id),
          ].slice(0, cap);

          return { ...previous, items, totalItems: items.length };
        },
      );
    };

    const flushBufferedBet = (betId: string) => {
      const timeoutId = timeouts.get(betId);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeouts.delete(betId);
      }

      const bufferedBet = buffer.get(betId);

      if (bufferedBet) {
        buffer.delete(betId);
        insertBet(bufferedBet);
      }
    };

    const handleNewBet = (raw: RawLiveBetItem) => {
      if (!shouldIncludeLiveBet(raw, params)) {
        return;
      }

      const isOwnBet = Boolean(currentUsername) && raw.username === currentUsername;
      const isAlreadyRevealed = useLiveBetRevealStore
        .getState()
        .revealedBetIds.includes(raw.betId);

      if (isOwnBet && !isAlreadyRevealed) {
        buffer.set(raw.betId, raw);

        const timeoutId = window.setTimeout(() => {
          flushBufferedBet(raw.betId);
        }, OWN_BET_REVEAL_TIMEOUT_MS);

        timeouts.set(raw.betId, timeoutId);
        return;
      }

      insertBet(raw);
    };

    socket.on(NEW_LIVE_BET_EVENT, handleNewBet);

    if (!socket.connected) {
      socket.connect();
    }

    const unsubscribeReveal = useLiveBetRevealStore.subscribe(
      (state, previousState) => {
        const betId = state.lastRevealedBetId;

        if (!betId || betId === previousState.lastRevealedBetId) {
          return;
        }

        flushBufferedBet(betId);
      },
    );

    return () => {
      socket.off(NEW_LIVE_BET_EVENT, handleNewBet);
      unsubscribeReveal();
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.clear();
    };
    // `params` is captured via the primitive deps below (variant/category/game).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, variant, category, game, currentUsername, queryClient]);
}

function shouldIncludeLiveBet(
  raw: RawLiveBetItem,
  params: BetHistoryQueryParams,
): boolean {
  if (params.variant === "game-live") {
    return (
      params.category === "all" && raw.gameName.toLowerCase() === params.game
    );
  }

  if (params.variant === "games-live") {
    return params.category === "all";
  }

  return false;
}
