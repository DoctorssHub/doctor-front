export type ProfileTab = "profile" | "bets" | "connections";

export type ProfileTabOption = {
  label: string;
  value: ProfileTab;
};

export const PROFILE_TABS: ProfileTabOption[] = [
  { label: "Profile", value: "profile" },
  { label: "Bets history", value: "bets" },
  { label: "Connections", value: "connections" },
];
