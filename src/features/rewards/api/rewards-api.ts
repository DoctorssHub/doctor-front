import { buildRewardsQueryParams } from "../lib/reward-query";
import { mapRewardDetailsResponse, mapRewardsResponse } from "../lib/reward-mappers";
import type {
  RewardDetails,
  RewardQuery,
  RewardsResponse,
} from "../model/types";

export async function getRewards(
  query: RewardQuery = {},
): Promise<RewardsResponse> {
  const response = await fetch(
    `/api/reward/query?${createRewardsSearch(query)}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load rewards.");
  }

  return mapRewardsResponse(await response.json());
}

export async function getRewardDetails(id: string): Promise<RewardDetails> {
  const response = await fetch(`/api/reward/query/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load reward details.");
  }

  return mapRewardDetailsResponse(await response.json());
}

function createRewardsSearch(query: RewardQuery) {
  const params = new URLSearchParams();
  const normalizedQuery = buildRewardsQueryParams(query);

  params.set("page", normalizedQuery.page.toString());
  params.set("take", normalizedQuery.take.toString());
  params.set("sort", normalizedQuery.sort);

  if (normalizedQuery.search) {
    params.set("search", normalizedQuery.search);
  }

  return params.toString();
}
