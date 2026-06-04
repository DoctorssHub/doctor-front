import Image from "next/image";

import type { Player } from "../model/players";

type AvatarRankProps = {
  avatar: Player["avatar"];
  rank: Player["rank"];
};

export function AvatarRank({ avatar, rank }: AvatarRankProps) {
  return (
    <div className="relative mx-auto h-[132px] w-[132px]">
      <div className="absolute inset-0 p-[4px]">
        <div className="relative size-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_35%,#19345d_0%,#10213c_56%,#0b1225_100%)]">
          <Image
            alt=""
            className="object-cover object-center"
            fill
            sizes="132px"
            src={avatar}
          />
        </div>
      </div>
      <Image
        alt=""
        className="absolute left-1/2 bottom-[-43px] z-10 h-auto w-[92px] -translate-x-1/2"
        src={rank}
      />
    </div>
  );
}
