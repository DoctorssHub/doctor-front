import type { RefObject } from "react";

type RouletteBallProps = {
  ballRef: RefObject<HTMLDivElement | null>;
  initialTransform: string;
};

export function RouletteBall({
  ballRef,
  initialTransform,
}: RouletteBallProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[6] h-[10px] w-[10px] rounded-full bg-[image:var(--gradient-roulette-ball)] shadow-[var(--shadow-roulette-ball)] will-change-transform"
      ref={ballRef}
      style={{ transform: initialTransform }}
    />
  );
}
