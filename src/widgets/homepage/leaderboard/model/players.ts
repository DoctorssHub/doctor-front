import type { StaticImageData } from "next/image";

import avatarOne from "@/assets/avatar_1.webp";
import avatarThree from "@/assets/avatar_3.webp";
import avatarTwo from "@/assets/avatar_2.webp";
import rankOne from "@/assets/rank_1.webp";
import rankThree from "@/assets/rank_3.webp";
import rankTwo from "@/assets/rank_2.webp";
import trophyOne from "@/assets/trophy_1.svg";
import trophyThree from "@/assets/trophy_3.svg";
import trophyTwo from "@/assets/trophy_2.svg";

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
