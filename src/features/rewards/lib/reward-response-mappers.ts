import type {
  Reward,
  RewardDetails,
  RewardsResponse,
} from "../model/types";
import { mapRewardContent } from "./reward-content-mapper";
import { asRecord, readNumber, readString } from "./reward-mapper-utils";

export function mapRewardsResponse(response: unknown): RewardsResponse {
  const data = asRecord(response);
  const rewards = Array.isArray(data.data) ? data.data : [];

  return {
    items: rewards.map(mapRewardResponse),
    page: readNumber(data.page),
    take: readNumber(data.take),
    total: readNumber(data.total),
    totalPages: readNumber(data.totalPages),
  };
}

export function mapRewardDetailsResponse(response: unknown): RewardDetails {
  const data = asRecord(response);

  return {
    ...mapRewardResponse(data),
    content: mapRewardContent(data.content),
  };
}

function mapRewardResponse(response: unknown): Reward {
  const data = asRecord(response);

  return {
    endDate: readString(data.endDate),
    id: readString(data.id),
    photoUrl: readString(data.photoUrl),
    shortDescription: readString(data.shortDescription),
    title: readString(data.title),
  };
}
