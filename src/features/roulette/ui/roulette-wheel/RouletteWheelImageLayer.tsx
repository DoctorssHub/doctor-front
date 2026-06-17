import Image from "next/image";
import type { RefObject } from "react";
import rouletteImage from "@/assets/games/roulette/rouletteImage.svg";

type RouletteWheelImageLayerProps = {
  wheelRef: RefObject<HTMLDivElement | null>;
};

export function RouletteWheelImageLayer({
  wheelRef,
}: RouletteWheelImageLayerProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-[283px] w-[283px] will-change-transform"
      ref={wheelRef}
      style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
    >
      <Image
        alt="roulette wheel"
        className="pointer-events-none h-full w-full object-contain"
        draggable={false}
        priority
        src={rouletteImage}
      />
      <div className="pointer-events-none absolute inset-0 z-[4] rounded-full bg-[image:var(--gradient-roulette-wheel-shine)]" />
      <div className="pointer-events-none absolute inset-0 z-[4] rounded-full bg-[image:var(--gradient-roulette-wheel-vignette)]" />
    </div>
  );
}
