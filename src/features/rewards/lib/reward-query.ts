import type { RewardQuery, RewardQueryParams } from "../model/types";

export const REWARDS_DEFAULT_QUERY: RewardQueryParams = {
  page: 1,
  sort: "createdAtDesc",
  take: 8,
};

const MAX_REWARDS_TAKE = 40;

export function buildRewardsQueryParams(
  query: RewardQuery = {},
): RewardQueryParams {
  const trimmedSearch = query.search?.trim();

  return {
    page: normalizePositiveInteger(query.page, REWARDS_DEFAULT_QUERY.page),
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    sort: query.sort ?? REWARDS_DEFAULT_QUERY.sort,
    take: Math.min(
      normalizePositiveInteger(query.take, REWARDS_DEFAULT_QUERY.take),
      MAX_REWARDS_TAKE,
    ),
  };
}

function normalizePositiveInteger(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}
