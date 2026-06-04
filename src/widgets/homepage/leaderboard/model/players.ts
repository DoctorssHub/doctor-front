import type { StaticImageData } from "next/image";

import avatarOne from "@/assets/avatar_1.webp";
import avatarThree from "@/assets/avatar_3.webp";
import avatarTwo from "@/assets/avatar_2.webp";
import rankOne from "@/assets/rank_1.webp";
import rankThree from "@/assets/rank_3.webp";
import rankTwo from "@/assets/rank_2.webp";

export type Player = {
  avatar: StaticImageData;
  prize: string;
  rank: StaticImageData;
  score: string;
  winner?: boolean;
};

export const players: Player[] = [
  { avatar: avatarTwo, prize: "1,500.00", rank: rankTwo, score: "1,234,567" },
  {
    avatar: avatarOne,
    prize: "1,500.00",
    rank: rankOne,
    score: "1,234,567",
    winner: true,
  },
  {
    avatar: avatarThree,
    prize: "1,500.00",
    rank: rankThree,
    score: "1,234,567",
  },
];
