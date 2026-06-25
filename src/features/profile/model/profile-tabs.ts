export type ProfileTab = "profile" | "bets";

export type ProfileTabOption = {
  label: string;
  value: ProfileTab;
};

export const PROFILE_TABS: ProfileTabOption[] = [
  { label: "Profile", value: "profile" },
  { label: "Bets history", value: "bets" },
];
