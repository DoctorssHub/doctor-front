import { buildRewardsQueryParams } from "../lib/reward-query";
import type { Reward, RewardQuery, RewardsResponse } from "../model/types";

type RawReward = {
  endDate: string;
  id: string;
  photoUrl: string;
  shortDescription: string;
  title: string;
};

type RawRewardsResponse = {
  data: RawReward[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};

export async function getRewards(
  query: RewardQuery = {},
): Promise<RewardsResponse> {
  const response = await fetch(`/api/reward/query?${createRewardsSearch(query)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load rewards.");
  }

  const data = (await response.json()) as RawRewardsResponse;

  return {
    items: data.data.map(mapReward),
    page: data.page,
    take: data.take,
    total: data.total,
    totalPages: data.totalPages,
  };
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

function mapReward(reward: RawReward): Reward {
  return {
    endDate: reward.endDate,
    id: reward.id,
    photoUrl: reward.photoUrl,
    shortDescription: reward.shortDescription,
    title: reward.title,
  };
}
