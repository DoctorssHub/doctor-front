import { getMultiplierTone } from "@/features/plinko/lib/board/multiplier";

type PlinkoVerifyPreviewProps = {
  bucketIndex: number | null;
  multipliers: number[];
};

export function PlinkoVerifyPreview({
  bucketIndex,
  multipliers,
}: PlinkoVerifyPreviewProps) {
  const resultMultiplier =
    bucketIndex !== null ? multipliers[bucketIndex] : undefined;

  if (resultMultiplier !== undefined) {
    return (
      <div className="flex justify-center py-8">
        <div
          className={[
            "grid h-12 min-w-24 place-items-center rounded-xl px-5 text-lg font-bold",
            getMultiplierTone(resultMultiplier, true),
          ].join(" ")}
        >
          {resultMultiplier}x
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4">
      <div className="flex max-w-[620px] flex-wrap justify-center gap-1">
        {multipliers.map((multiplier, index) => (
          <div
            className={[
              "grid h-8 w-12 place-items-center rounded-lg px-2 text-xs font-bold tablet:h-9 tablet:w-13 tablet:text-sm",
              getMultiplierTone(multiplier, false),
            ].join(" ")}
            key={`${multiplier}-${index}`}
          >
            {multiplier}x
          </div>
        ))}
      </div>
    </div>
  );
}
