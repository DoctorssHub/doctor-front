import Image from "next/image";
import rangeLineIcon from "@/assets/games/dice/rangeLineIcon.svg";
import resultPolygonIcon from "@/assets/games/dice/resultPolygonIcon.svg";

type DiceVerifyPreviewProps = {
  roll: number | null;
};

export function DiceVerifyPreview({ roll }: DiceVerifyPreviewProps) {
  const clampedRoll = Math.min(100, Math.max(2, roll ?? 50));
  const markerLeft = `clamp(30px, ${((clampedRoll - 2) / 98) * 100}%, calc(100% - 30px))`;
  const isGreenResult = clampedRoll >= 50;
  const resultGradient = isGreenResult
    ? "linear-gradient(90deg, rgba(43, 48, 59, 0.4) 0%, rgba(74, 222, 128, 0.4) 54.81%, rgba(43, 48, 59, 0.4) 100%)"
    : "linear-gradient(90deg, rgba(43, 48, 59, 0.4) 0%, rgba(239, 68, 68, 0.4) 54.81%, rgba(43, 48, 59, 0.4) 100%)";

  return (
    <div className="pb-5 pt-12">
      <div className="relative rounded-2xl border-[6px] border-[var(--color-surface-icon)] bg-[var(--color-surface)] px-4 py-6">
        <div className="relative h-3 overflow-visible rounded-full bg-[var(--color-brand)]">
          {roll !== null ? (
            <div
              className="absolute -top-[80px] grid h-[42px] w-[60px] place-items-center rounded-[6px] p-1 text-sm font-semibold text-[#fdfdfd] backdrop-blur-[8px]"
              style={{
                background: resultGradient,
                left: markerLeft,
                transform: "translateX(-50%)",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-1 rounded-[3px] bg-[#0a0d19]"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-full h-2.5 w-[13px] -translate-x-1/2"
                style={{
                  background: resultGradient,
                  maskImage: `url(${resultPolygonIcon.src})`,
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                  WebkitMaskImage: `url(${resultPolygonIcon.src})`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                }}
              />
              <span className="relative">{roll.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="h-full w-1/2 rounded-l-full bg-[var(--color-accent-red)]" />
          <div className="absolute left-1/2 top-1/2 grid h-8 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[4px] bg-[#3f4a59]">
            <Image alt="" height={16} src={rangeLineIcon} width={17} />
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 text-sm font-bold text-[var(--color-text-primary)]">
        {[2, 25, 50, 75, 100].map((tick) => (
          <span
            className={tick === 100 ? "text-right" : tick === 2 ? "" : "text-center"}
            key={tick}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
