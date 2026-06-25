import type { StaticImageData } from "next/image";

import avatarOne from "@/assets/homePage/leaderboardSection/avatar_1.webp";
import avatarThree from "@/assets/homePage/leaderboardSection/avatar_3.webp";
import avatarTwo from "@/assets/homePage/leaderboardSection/avatar_2.webp";
import rankOne from "@/assets/homePage/leaderboardSection/rank_1.webp";
import rankThree from "@/assets/homePage/leaderboardSection/rank_3.webp";
import rankTwo from "@/assets/homePage/leaderboardSection/rank_2.webp";
import trophyOne from "@/assets/homePage/leaderboardSection/trophy_1.svg";
import trophyThree from "@/assets/homePage/leaderboardSection/trophy_3.svg";
import trophyTwo from "@/assets/homePage/leaderboardSection/trophy_2.svg";

export type Player = {
  avatar: StaticImageData;
  username: string;
  prize: string;
  rank: StaticImageData;
  score: string;
  trophy: StaticImageData;
  winner?: boolean;
};

export const players: Player[] = [
  {
    avatar: avatarTwo,
    username: "Username1",
    prize: "1,500.00",
    rank: rankTwo,
    score: "1,234,567",
    trophy: trophyTwo,
  },
  {
    avatar: avatarOne,
    username: "Username2",
    prize: "1,500.00",
    rank: rankOne,
    score: "1,234,567",
    trophy: trophyOne,
    winner: true,
  },
  {
    avatar: avatarThree,
    username: "Username3",
    prize: "1,500.00",
    rank: rankThree,
    score: "1,234,567",
    trophy: trophyThree,
  },
];
