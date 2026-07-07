import Image from "next/image";
import { useCallback, useState } from "react";
import { useGameSettingsStore } from "@/shared/model/game-settings-store";
import rangeLineIcon from "@/assets/games/dice/rangeLineIcon.svg";
import resultPolygonIcon from "@/assets/games/dice/resultPolygonIcon.svg";
import type { DiceBetResponse } from "../../api/dice-types";

type DiceRangeProps = {
  isFullscreen?: boolean;
  isLoading: boolean;
  result: DiceBetResponse | null;
  threshold: number;
  onThresholdChange: (threshold: number) => void;
};

const tickMarks = [2, 25, 50, 75, 100];

export function DiceRange({
  isFullscreen = false,
  isLoading,
  result,
  threshold,
  onThresholdChange,
}: DiceRangeProps) {

  const [draftThreshold, setDraftThreshold] = useState(threshold);
  const isTurboModeEnabled = useGameSettingsStore(
    (state) => state.isTurboModeEnabled,
  );
  const markerLeft = `clamp(18px, ${draftThreshold}%, calc(100% - 18px))`;
  const visibleResult = result;
  const resultPosition = visibleResult
    ? `clamp(30px, ${visibleResult.randomValue}%, calc(100% - 30px))`
    : null;
  const resultGradient = visibleResult?.didWin
    ? "linear-gradient(90deg, rgba(43, 48, 59, 0.4) 0%, rgba(74, 222, 128, 0.4) 54.81%, rgba(43, 48, 59, 0.4) 100%)"
    : "linear-gradient(90deg, rgba(43, 48, 59, 0.4) 0%, rgba(239, 68, 68, 0.4) 54.81%, rgba(43, 48, 59, 0.4) 100%)";

  const commitThreshold = useCallback(() => {
    onThresholdChange(draftThreshold);
  }, [draftThreshold, onThresholdChange]);

  function handleDraftChange(value: string) {
    setDraftThreshold(Number(value));
  }

  return (
    <div
      className={[
        "mx-auto w-full pt-12 max-[767px]:pt-20",
        isFullscreen ? "max-w-none" : "max-w-[601px]",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-12 max-w-full rounded-xl border-[6px] border-[#1b1f26] bg-[#0e121c] px-4 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
          isFullscreen ? "w-full" : "w-[601px]",
        ].join(" ")}
      >
        {tickMarks.map((tick) => (
          <span
            aria-hidden="true"
            className="absolute -bottom-[15px] z-0 h-[18px] w-6 -translate-x-1/2 bg-[#1b1f26]"
            key={`triangle-${tick}`}
            style={{
              left: `clamp(12px, ${tick}%, calc(100% - 12px))`,
              maskImage: `url(${resultPolygonIcon.src})`,
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskImage: `url(${resultPolygonIcon.src})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
            }}
          />
        ))}

        {resultPosition && visibleResult ? (
          <div
            className={`absolute -top-[80px] z-10 grid h-[42px] w-[60px] place-items-center rounded-[6px] p-1 text-sm font-semibold text-[#fdfdfd] backdrop-blur-[8px] ${
              isTurboModeEnabled
                ? ""
                : "transition-[left,background] duration-500 ease-out will-change-[left]"
            }`}
            style={{
              background: resultGradient,
              left: resultPosition,
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
            <span className="relative">
              {visibleResult.randomValue.toFixed(2)}
            </span>
          </div>
        ) : null}

        <div className="relative z-10 h-full">
          <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full bg-[#22c55e]">
            <div
              className="absolute top-0 h-full bg-[var(--color-accent-red)]"
              style={{ left: 0, width: `${draftThreshold}%` }}
            />
          </div>
          <div
            className="pointer-events-none absolute top-1/2 grid h-8 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[4px] bg-[#3f4a59]"
            style={{ left: markerLeft }}
          >
            <Image alt="" height={16} src={rangeLineIcon} width={17} />
          </div>
          <input
            aria-label="Dice rollover threshold"
            className="dice-range-input absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
            disabled={isLoading}
            max={99.99}
            min={0.01}
            onBlur={commitThreshold}
            onChange={(event) => handleDraftChange(event.target.value)}
            onKeyUp={commitThreshold}
            onPointerUp={commitThreshold}
            step={0.01}
            type="range"
            value={draftThreshold}
          />
        </div>
      </div>

      <div className="relative mt-3 h-7 text-center text-xs font-semibold leading-[1.33] text-[rgba(255,255,255,0.95)]">
        {tickMarks.map((tick) => (
          <span
            className="absolute -translate-x-1/2"
            key={tick}
            style={{ left: `${tick}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
