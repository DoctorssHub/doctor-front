export type RewardSort = "createdAtDesc";

export type RewardQuery = {
  page?: number;
  search?: string;
  sort?: RewardSort;
  take?: number;
};

export type RewardQueryParams = {
  page: number;
  search?: string;
  sort: RewardSort;
  take: number;
};

export type Reward = {
  endDate: string;
  id: string;
  photoUrl: string;
  shortDescription: string;
  title: string;
};

export type RewardsResponse = {
  items: Reward[];
  page: number;
  take: number;
  total: number;
  totalPages: number;
};
