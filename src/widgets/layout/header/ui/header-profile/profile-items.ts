import betHistoryIcon from "@/assets/shared/betHistory.svg";
import profileIcon from "@/assets/shared/profileIcon.svg";

export const headerProfileItems = [
  {
    icon: profileIcon,
    label: "Profile",
    type: "profile",
  },
  {
    icon: betHistoryIcon,
    label: "Bets History",
    type: "bets-history",
  },
] as const;
