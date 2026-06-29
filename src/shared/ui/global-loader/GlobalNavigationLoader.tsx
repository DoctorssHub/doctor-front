"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsFetching, type QueryKey } from "@tanstack/react-query";
import { GlobalLoader } from "./GlobalLoader";

const EXIT_MS = 480;
const READINESS_DELAY_MS = 80;
const CRITICAL_QUERY_SETTLE_MS = 260;
const NAVIGATION_TIMEOUT_MS = 5000;

type LoaderPhase = "hidden" | "visible" | "exiting";
type QueryKeyPrefix = readonly unknown[];

const GAME_ROUTES = ["plinko", "roulette", "dice", "keno"] as const;

const ROUTE_CRITICAL_QUERIES: Record<string, QueryKeyPrefix[]> = {
  profile: [["profile", "me"]],
  leaderboard: [["leaderboard"]],
};

function getCriticalQueryPrefixes(pathname: string): QueryKeyPrefix[] {
  for (const game of GAME_ROUTES) {
    if (pathname.includes(game)) {
      return [[game], ["me"]];
    }
  }

  for (const [route, prefixes] of Object.entries(ROUTE_CRITICAL_QUERIES)) {
    if (pathname.includes(route)) {
      return prefixes;
    }
  }

  return [];
}

function matchesQueryPrefix(queryKey: QueryKey, prefix: QueryKeyPrefix) {
  return prefix.every((part, index) => queryKey[index] === part);
}

function isCriticalQueryKey(pathname: string, queryKey: QueryKey) {
  return getCriticalQueryPrefixes(pathname).some((prefix) =>
    matchesQueryPrefix(queryKey, prefix),
  );
}

function hasCriticalQueries(pathname: string) {
  return getCriticalQueryPrefixes(pathname).length > 0;
}

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const activeFetchCount = useIsFetching({
    predicate: (query) => isCriticalQueryKey(pathname, query.queryKey),
  });

  const pathnameRef = useRef(pathname);
  const previousPathnameRef = useRef(pathname);
  const didMountRef = useRef(false);
  const observedCriticalFetchRef = useRef(activeFetchCount > 0);
  const activeFetchCountRef = useRef(activeFetchCount);
  const pendingRef = useRef(true);
  const readinessTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<LoaderPhase>("visible");

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    activeFetchCountRef.current = activeFetchCount;
  }, [activeFetchCount]);

  const clearTimers = useCallback(() => {
    if (readinessTimerRef.current !== null) {
      window.clearTimeout(readinessTimerRef.current);
      readinessTimerRef.current = null;
    }

    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (watchdogTimerRef.current !== null) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  const hideLoader = useCallback(() => {
    clearTimers();
    setPhase("exiting");

    hideTimerRef.current = window.setTimeout(() => {
      pendingRef.current = false;
      observedCriticalFetchRef.current = false;
      setPhase("hidden");
    }, EXIT_MS);
  }, [clearTimers]);

  const scheduleHideWhenReady = useCallback(() => {
    if (!pendingRef.current) {
      return;
    }

    if (activeFetchCountRef.current > 0) {
      return;
    }

    if (readinessTimerRef.current !== null) {
      window.clearTimeout(readinessTimerRef.current);
    }

    const shouldWaitForQueryRegistration =
      hasCriticalQueries(pathnameRef.current) && !observedCriticalFetchRef.current;
    const readinessDelayMs = shouldWaitForQueryRegistration
      ? CRITICAL_QUERY_SETTLE_MS
      : READINESS_DELAY_MS;

    readinessTimerRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (activeFetchCountRef.current === 0) {
            hideLoader();
          }
        });
      });
    }, readinessDelayMs);
  }, [hideLoader]);

  // Initial page load
  useEffect(() => {
    scheduleHideWhenReady();
  }, [scheduleHideWhenReady]);

  // Navigation: reset pending state when pathname changes
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      previousPathnameRef.current = pathname;
      return;
    }

    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;

    clearTimers();
    pendingRef.current = true;
    observedCriticalFetchRef.current = false;
    setPhase("visible");

    watchdogTimerRef.current = window.setTimeout(() => {
      hideLoader();
    }, NAVIGATION_TIMEOUT_MS);

    scheduleHideWhenReady();
  }, [pathname, clearTimers, hideLoader, scheduleHideWhenReady]);

  // React to critical query fetch count changes
  useEffect(() => {
    if (activeFetchCount > 0) {
      observedCriticalFetchRef.current = true;

      clearTimers();

      if (pendingRef.current) {
        setPhase("visible");
      }

      return;
    }

    scheduleHideWhenReady();
  }, [activeFetchCount, clearTimers, scheduleHideWhenReady]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  if (phase === "hidden") {
    return null;
  }

  return <GlobalLoader isExiting={phase === "exiting"} />;
}
