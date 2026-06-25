// NOTE: The exact response shapes of `/user/query/me/stats` and
// `/user/query/settings` are not yet confirmed against the backend. These
// types follow the profile mockup and are parsed defensively in `model`.

export type ProfileStatsResponse = {
  totalWagered: number | string | null;
  wagerPointsSpent: number | string | null;
};

export type ProfileSettingsResponse = {
  privateMode: boolean;
};

export type ProfileStats = {
  totalWagered: string;
  wagerPointsSpent: string;
};

export type ProfileSettings = {
  privateMode: boolean;
};
