import Image from "next/image";

import type { Player } from "../model/players";

type AvatarRankProps = {
  avatar: Player["avatar"];
  rank: Player["rank"];
  username: Player["username"];
};

export function AvatarRank({ avatar, rank, username }: AvatarRankProps) {
  return (
    <div className="relative mx-auto h-[100px] w-[100px]">
      <div className="absolute inset-0 p-[4px]">
        <div className="relative size-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_35%,#19345d_0%,#10213c_56%,#0b1225_100%)]">
          <Image
            alt={`${username} avatar`}
            className="object-cover object-center"
            fill
            sizes="100px"
            src={avatar}
          />
        </div>
      </div>
      <Image
        alt={`${username} rank badge`}
        className="absolute left-1/2 bottom-[-28px] z-10 h-auto w-[60px] -translate-x-1/2"
        src={rank}
      />
    </div>
  );
}
