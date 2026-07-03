"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsFetching } from "@tanstack/react-query";
import { hasCriticalQueries, isCriticalQueryKey } from "./critical-queries";

const EXIT_MS = 480;
const READINESS_DELAY_MS = 80;
const CRITICAL_QUERY_SETTLE_MS = 260;
const NAVIGATION_TIMEOUT_MS = 5000;
const LEADERBOARD_LOADER_TOTAL_MS = 1500;
const LEADERBOARD_LOADER_BEFORE_EXIT_MS = Math.max(
  0,
  LEADERBOARD_LOADER_TOTAL_MS - EXIT_MS,
);

type LoaderPhase = "hidden" | "visible" | "exiting";

function getMinimumLoaderBeforeExitMs(pathname: string) {
  return pathname === "/leaderboard" ||
    pathname === "/all-games" ||
    pathname.startsWith("/all-games/") ||
    pathname === "/rewards" ||
    pathname.startsWith("/rewards/")
    ? LEADERBOARD_LOADER_BEFORE_EXIT_MS
    : 0;
}

export function useLoaderPhase(): LoaderPhase {
  const pathname = usePathname();
  const activeFetchCount = useIsFetching({
    predicate: (query) => isCriticalQueryKey(pathname, query.queryKey),
  });

  const prevPathnameRef = useRef(pathname);
  const pendingRef = useRef(true);
  const seenFetchRef = useRef(activeFetchCount > 0);
  const fetchCountRef = useRef(activeFetchCount);
  const loaderStartedAtRef = useRef(0);
  const readinessTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<LoaderPhase>("visible");

  useEffect(() => {
    fetchCountRef.current = activeFetchCount;
  }, [activeFetchCount]);

  const clearReadinessTimer = useCallback(() => {
    if (readinessTimerRef.current !== null) {
      window.clearTimeout(readinessTimerRef.current);
      readinessTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearReadinessTimer();

    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (watchdogTimerRef.current !== null) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, [clearReadinessTimer]);

  const hideLoader = useCallback(() => {
    clearAllTimers();
    pendingRef.current = false;
    seenFetchRef.current = false;
    setPhase("exiting");

    hideTimerRef.current = window.setTimeout(() => {
      setPhase("hidden");
    }, EXIT_MS);
  }, [clearAllTimers]);

  const scheduleHide = useCallback((currentPathname: string) => {
    if (!pendingRef.current || fetchCountRef.current > 0) {
      return;
    }

    clearReadinessTimer();

    const awaitingFirstFetch =
      hasCriticalQueries(currentPathname) && !seenFetchRef.current;
    const settleDelayMs = awaitingFirstFetch
      ? CRITICAL_QUERY_SETTLE_MS
      : READINESS_DELAY_MS;
    const minimumBeforeExitMs = getMinimumLoaderBeforeExitMs(currentPathname);
    if (loaderStartedAtRef.current === 0) {
      loaderStartedAtRef.current = Date.now();
    }

    const elapsedMs = Date.now() - loaderStartedAtRef.current;
    const remainingMinimumMs = Math.max(0, minimumBeforeExitMs - elapsedMs);
    const delayMs = Math.max(settleDelayMs, remainingMinimumMs);

    readinessTimerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        if (fetchCountRef.current === 0) {
          hideLoader();
        }
      });
    }, delayMs);
  }, [clearReadinessTimer, hideLoader]);

  // Initial page load: watchdog to force-hide if queries never settle
  useEffect(() => {
    loaderStartedAtRef.current = Date.now();

    watchdogTimerRef.current = window.setTimeout(() => {
      hideLoader();
    }, NAVIGATION_TIMEOUT_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigation: show loader when pathname changes
  useEffect(() => {
    if (prevPathnameRef.current === pathname) {
      return;
    }

    prevPathnameRef.current = pathname;

    clearAllTimers();
    pendingRef.current = true;
    seenFetchRef.current = false;
    loaderStartedAtRef.current = Date.now();
    setPhase("visible");

    watchdogTimerRef.current = window.setTimeout(() => {
      hideLoader();
    }, NAVIGATION_TIMEOUT_MS);

    scheduleHide(pathname);
  }, [pathname, clearAllTimers, hideLoader, scheduleHide]);

  // Hold loader while critical queries are in-flight
  useEffect(() => {
    if (activeFetchCount > 0) {
      seenFetchRef.current = true;
      clearReadinessTimer();

      if (pendingRef.current && hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
        setPhase("visible");
      }

      return;
    }

    scheduleHide(pathname);
  }, [activeFetchCount, pathname, clearReadinessTimer, scheduleHide]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return phase;
}
