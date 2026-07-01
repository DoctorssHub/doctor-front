import bonusesIcon from "@/assets/aside/bonuses.svg";
import diceIcon from "@/assets/aside/dice.svg";
import gamesIcon from "@/assets/aside/games.svg";
import kenoIcon from "@/assets/aside/keno.svg";
import leaderboardIcon from "@/assets/aside/leaderboard.svg";
import plinkoIcon from "@/assets/aside/plinko.svg";
import rewardsIcon from "@/assets/aside/rewards.svg";
import rouletteIcon from "@/assets/aside/roulette.svg";
import wheelIcon from "@/assets/aside/wheel.svg";
import winnersIcon from "@/assets/aside/winners.svg";

import type { NavItem } from "./types";

export const navItems: NavItem[] = [
 
  {
    href: "/leaderboard",
    icon: leaderboardIcon,
    title: "Leaderboard",
    type: "link",
  },
  {
    children: [
      {
        href: "/all-games/roulette",
        icon: rouletteIcon,
        title: "Roulette",
        type: "link",
      },
      {
        href: "/all-games/keno",
        icon: kenoIcon,
        title: "Keno",
        type: "link",
      },
      {
        href: "/all-games/plinko",
        icon: plinkoIcon,
        title: "Plinko",
        type: "link",
      },
      {
        href: "/all-games/dice",
        icon: diceIcon,
        title: "Dice",
        type: "link",
      },
    ],
    href: "/all-games",
    icon: gamesIcon,
    title: "Games",
    type: "dropdown",
  },
  {
    href: "/rewards",
    icon: rewardsIcon,
    title: "Rewards",
    type: "link",
  },
  {
    href: "#",
    icon: bonusesIcon,
    title: "Bonuses",
    type: "link",
  },
  {
    href: "#",
    icon: wheelIcon,
    title: "The Wheel",
    type: "link",
  },
  {
    href: "#",
    icon: winnersIcon,
    title: "Bonus Buy Winners",
    type: "link",
  },
];
