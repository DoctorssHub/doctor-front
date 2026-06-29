import type { QueryKey } from "@tanstack/react-query";

type QueryKeyPrefix = readonly unknown[];

const GAME_ROUTES = ["plinko", "roulette", "dice", "keno"] as const;

const ROUTE_CRITICAL_QUERIES: Record<string, QueryKeyPrefix[]> = {
  profile: [["profile", "me"]],
  leaderboard: [["leaderboard"]],
};

export function getCriticalQueryPrefixes(pathname: string): QueryKeyPrefix[] {
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

export function isCriticalQueryKey(pathname: string, queryKey: QueryKey) {
  return getCriticalQueryPrefixes(pathname).some((prefix) =>
    matchesQueryPrefix(queryKey, prefix),
  );
}

export function hasCriticalQueries(pathname: string) {
  return getCriticalQueryPrefixes(pathname).length > 0;
}
