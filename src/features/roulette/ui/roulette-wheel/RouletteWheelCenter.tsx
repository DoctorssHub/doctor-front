import Image from "next/image";
import type { RefObject } from "react";
import rouletteCenter from "@/assets/games/roulette/rouletteCenter.svg";

type RouletteWheelCenterProps = {
  centerRef: RefObject<HTMLDivElement | null>;
};

export function RouletteWheelCenter({ centerRef }: RouletteWheelCenterProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[90px] w-[90px] will-change-transform"
      ref={centerRef}
      style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
    >
      <Image
        alt=""
        className="h-full w-full object-contain"
        draggable={false}
        priority
        src={rouletteCenter}
      />
    </div>
  );
}
