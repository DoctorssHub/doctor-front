import connectionsIcon from "@/assets/profile/conections.svg";
import betHistoryIcon from "@/assets/shared/betHistory.svg";
import profileIcon from "@/assets/shared/profileIcon.svg";

export const headerProfileItems = [
  {
    href: "/profile",
    icon: profileIcon,
    label: "Profile",
    type: "profile",
  },
  {
    href: "/profile?tab=bets-history",
    icon: betHistoryIcon,
    label: "Bets History",
    type: "bets-history",
  },
  {
    href: "/profile?tab=connections",
    icon: connectionsIcon,
    label: "Connections",
    type: "connections",
  },
] as const;
