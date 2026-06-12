import type { CSSProperties } from "react";
import type { getBucketLayout } from "@/widgets/plinko-board/lib/animation";
import { getMultiplierTone } from "@/widgets/plinko-board/lib/multiplier";

type BucketLayout = ReturnType<typeof getBucketLayout>;

type PlinkoBucketsProps = {
  impactKeys: Map<number, string>;
  layout: BucketLayout;
  multiplierSlots: number[];
};

export function PlinkoBuckets({
  impactKeys,
  layout,
  multiplierSlots,
}: PlinkoBucketsProps) {
  return (
    <div
      className="absolute bottom-0 left-1/2 flex max-w-full -translate-x-1/2 justify-center"
      style={{ gap: layout.bucketGap }}
    >
      {multiplierSlots.map((slot, index) => {
        const impactKey = impactKeys.get(index);
        const isActive = impactKey !== undefined;

        return (
          <div
            className={`flex origin-bottom items-center justify-center border text-[9px] font-bold transition-[box-shadow,background-color,border-color,color] duration-200 max-[340px]:text-[8px] md:text-[10px] ${isActive ? "plinko-bucket-hit" : ""} ${getMultiplierTone(slot, isActive)}`}
            key={`${slot}-${index}-${impactKey ?? "idle"}`}
            style={
              {
                borderRadius: layout.bucketRadius,
                height: layout.bucketHeight,
                paddingInline: layout.bucketHorizontalPadding,
                width: layout.bucketWidth,
              } as CSSProperties
            }
          >
            {slot}x
          </div>
        );
      })}
    </div>
  );
}
