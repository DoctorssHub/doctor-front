"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { KENO_NUMBERS } from "../../model/keno-constants";
import { useKenoControlsStore } from "../../model/keno-controls-store";
import { KENO_MULTIPLIERS } from "../../model/keno-multipliers";

const RESULT_REVEAL_DELAY_MS = 120;
const RESULT_REVEAL_COMPLETE_DELAY_MS = 220;

const manualSelectionKeyframes: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.55, transform: "scale(1.15)" },
  { transform: "scale(1)" },
];

const autoSelectionKeyframes: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.55, transform: "scale(1.15)" },
  { transform: "scale(1)" },
];

const resultRevealKeyframes: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.65, transform: "scale(1.1)" },
  { transform: "scale(1)" },
];

const hitRevealKeyframes: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.5, transform: "scale(1.16)" },
  { transform: "scale(1)" },
];

const missRevealKeyframes: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.5, transform: "scale(1.08)" },
  { transform: "scale(1)" },
];

type KenoNumberGridProps = {
  isInteractionLocked: boolean;
  isRevealingResults: boolean;
  onResultsReset: () => void;
  onRevealComplete: () => void;
  resultNumbers: number[];
  roundSelectedNumbers: number[];
};

export function KenoNumberGrid({
  isInteractionLocked,
  isRevealingResults,
  onResultsReset,
  onRevealComplete,
  resultNumbers,
  roundSelectedNumbers,
}: KenoNumberGridProps) {
  const {
    autoPickingNumber,
    isAutoPicking,
    risk,
    selectedNumbers,
    toggleNumber,
  } = useKenoControlsStore(
    useShallow((state) => ({
      autoPickingNumber: state.autoPickingNumber,
      isAutoPicking: state.isAutoPicking,
      risk: state.risk,
      selectedNumbers: state.selectedNumbers,
      toggleNumber: state.toggleNumber,
    })),
  );
  const [revealedResultNumbers, setRevealedResultNumbers] = useState<number[]>(
    [],
  );
  const [revealedMissNumbers, setRevealedMissNumbers] = useState<number[]>([]);
  const tileRefs = useRef(new Map<number, HTMLButtonElement>());
  const selectedNumbersCount = selectedNumbers.length;
  const hasSettledResults = resultNumbers.length > 0 && !isRevealingResults;
  const multipliers = KENO_MULTIPLIERS[risk][selectedNumbersCount] ?? [];

  useEffect(() => {
    if (autoPickingNumber === null) {
      return;
    }

    tileRefs.current.get(autoPickingNumber)?.animate(autoSelectionKeyframes, {
      duration: 220,
      easing: "linear",
    });
  }, [autoPickingNumber]);

  useEffect(() => {
    if (resultNumbers.length === 0) {
      return;
    }

    const revealNumbers = KENO_NUMBERS.filter(
      (number) =>
        resultNumbers.includes(number) ||
        (roundSelectedNumbers.includes(number) &&
          !resultNumbers.includes(number)),
    );
    let timeoutId: ReturnType<typeof setTimeout>;
    let revealIndex = 0;

    function revealNextNumber() {
      const nextNumber = revealNumbers[revealIndex];
      const isResultNumber = resultNumbers.includes(nextNumber);

      if (isResultNumber) {
        setRevealedResultNumbers((currentNumbers) => [
          ...currentNumbers,
          nextNumber,
        ]);
      } else {
        setRevealedMissNumbers((currentNumbers) => [
          ...currentNumbers,
          nextNumber,
        ]);
      }

      revealIndex += 1;

      if (revealIndex < revealNumbers.length) {
        timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);
        return;
      }

      timeoutId = setTimeout(onRevealComplete, RESULT_REVEAL_COMPLETE_DELAY_MS);
    }

    timeoutId = setTimeout(revealNextNumber, RESULT_REVEAL_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [onRevealComplete, resultNumbers, roundSelectedNumbers]);

  useEffect(() => {
    const revealedNumber = revealedResultNumbers.at(-1);

    if (revealedNumber === undefined) {
      return;
    }

    const keyframes = roundSelectedNumbers.includes(revealedNumber)
      ? hitRevealKeyframes
      : resultRevealKeyframes;

    tileRefs.current.get(revealedNumber)?.animate(keyframes, {
      duration: 320,
      easing: "cubic-bezier(0.2, 0.9, 0.28, 1.1)",
    });
  }, [revealedResultNumbers, roundSelectedNumbers]);

  useEffect(() => {
    const revealedNumber = revealedMissNumbers.at(-1);

    if (revealedNumber === undefined) {
      return;
    }

    tileRefs.current.get(revealedNumber)?.animate(missRevealKeyframes, {
      duration: 260,
      easing: "cubic-bezier(0.2, 0.9, 0.28, 1.1)",
    });
  }, [revealedMissNumbers]);

  const handleNumberClick = (
    event: MouseEvent<HTMLButtonElement>,
    number: number,
  ) => {
    event.currentTarget.animate(manualSelectionKeyframes, {
      duration: 240,
      easing: "cubic-bezier(0.2, 0.9, 0.28, 1.1)",
    });
    toggleNumber(number);
  };

  return (
    <section
      className="flex min-w-0 flex-col bg-[#0e1519] px-[43px] pt-11 max-[1023px]:order-1 max-[1023px]:items-center max-[1023px]:px-5 max-[1023px]:pt-[84px] max-[1023px]:pb-[84px] max-[767px]:px-4 max-[767px]:pt-10 max-[767px]:pb-10"
      onClickCapture={(event) => {
        if (!hasSettledResults) {
          return;
        }

        event.stopPropagation();
        onResultsReset();
      }}
    >
      <div className="grid w-fit grid-cols-8 gap-1.5 max-[767px]:gap-[3px]">
        {KENO_NUMBERS.map((number) => {
          const isSelected = selectedNumbers.includes(number);
          const isRevealedResult = revealedResultNumbers.includes(number);
          const isHit =
            roundSelectedNumbers.includes(number) && isRevealedResult;
          const isMiss = revealedMissNumbers.includes(number);

          return (
            <button
              aria-label={`${isSelected ? "Deselect" : "Select"} number ${number}`}
              aria-pressed={isSelected}
              className={getTileClassName({
                isHit,
                isMiss,
                isRevealedResult,
                isSelected,
              })}
              disabled={isAutoPicking || isInteractionLocked}
              key={number}
              onClick={(event) => handleNumberClick(event, number)}
              ref={(element) => {
                if (element) {
                  tileRefs.current.set(number, element);
                } else {
                  tileRefs.current.delete(number);
                }
              }}
              type="button"
            >
              {isHit ? <KenoDiamond /> : null}
              {isHit ? <KenoHitPulseBorder /> : null}
              {isMiss ? <KenoMissCorners /> : null}
              <span className="relative z-10">{number}</span>
            </button>
          );
        })}
      </div>
      <KenoMultiplierPanel
        multipliers={multipliers}
        selectedNumbersCount={selectedNumbersCount}
      />
    </section>
  );
}

type TileState = {
  isHit: boolean;
  isMiss: boolean;
  isRevealedResult: boolean;
  isSelected: boolean;
};

function getTileClassName({
  isHit,
  isMiss,
  isRevealedResult,
  isSelected,
}: TileState) {
  const baseClassName =
    "relative grid size-[67px] place-items-center overflow-hidden rounded-xl border text-xl max-[767px]:size-[38px] max-[767px]:rounded-lg max-[767px]:text-xs font-semibold transition-[transform,border-color,background-color,box-shadow,color] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-highlight)] disabled:cursor-wait disabled:hover:scale-100 disabled:active:scale-100";

  if (isHit) {
    return [
      baseClassName,
      "overflow-visible border-[#43f785] bg-transparent text-black shadow-[0_0_24px_rgb(34_197_94/48%)]",
    ].join(" ");
  }

  if (isRevealedResult) {
    return [
      baseClassName,
      "border-[#3dea7d] bg-[linear-gradient(145deg,#42e781_0%,#1fb65e_100%)] text-[#061b10] shadow-[0_0_20px_rgb(34_197_94/32%)]",
    ].join(" ");
  }

  if (isMiss) {
    return [
      baseClassName,
      "border-[var(--color-brand-hover)] bg-transparent text-[var(--color-brand-hover)] shadow-[0_0_18px_rgb(239_68_68/28%)] hover:border-[var(--color-highlight)]",
    ].join(" ");
  }

  if (isSelected) {
    return [
      baseClassName,
      "border-[var(--color-brand-hover)] bg-[linear-gradient(145deg,var(--color-brand-hover)_0%,var(--color-brand)_48%,#8f1720_100%)] text-[var(--color-brand-contrast)] shadow-[var(--shadow-brand-glow)] hover:border-[var(--color-highlight)] hover:shadow-[0_0_18px_rgb(250_204_21/22%)]",
    ].join(" ");
  }

  return [
    baseClassName,
    "border-[#303846] bg-[linear-gradient(145deg,#202630_0%,#252c37_100%)] text-white hover:scale-[1.035] hover:border-[var(--color-highlight)] hover:shadow-[0_0_18px_rgb(250_204_21/22%)]",
  ].join(" ");
}

type KenoMultiplierPanelProps = {
  multipliers: number[];
  selectedNumbersCount: number;
};

function KenoMultiplierPanel({
  multipliers,
  selectedNumbersCount,
}: KenoMultiplierPanelProps) {
  if (selectedNumbersCount === 0) {
    return (
      <div className="mt-8 grid h-[67px] w-full max-w-[578px] place-items-center rounded-xl bg-[#202731] text-sm font-medium text-white/75 max-[767px]:mt-5 max-[767px]:h-11 max-[767px]:max-w-[325px] max-[767px]:text-[10px]">
        Select numbers 1-10 to start
      </div>
    );
  }

  return (
    <div
      className="mt-8 grid h-[50px] w-full max-w-[578px] gap-1 max-[767px]:mt-5 max-[767px]:h-11 max-[767px]:max-w-[325px] max-[767px]:gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${multipliers.length}, minmax(0, 1fr))`,
      }}
    >
      {multipliers.map((multiplier, hitCount) => (
        <div
          className="overflow-hidden rounded-[7px] border border-[#2e3a46] bg-[#242b36] text-center shadow-[0_8px_18px_rgb(0_0_0/18%)]"
          key={`${hitCount}-${multiplier}`}
        >
          <div className="flex h-[25px] items-center justify-center gap-1 max-[767px]:h-[22px] max-[767px]:gap-0.5 bg-[linear-gradient(rgb(10,39,26)_0%,rgb(57,177,125)_100%)] text-[11px] font-semibold text-white max-[767px]:text-[8px] shadow-[inset_0_-1px_0_rgb(255_255_255/12%)]">
            <KenoSmallGem />
            <span>{hitCount}x</span>
          </div>
          <div className="grid h-[25px] place-items-center text-[9px] max-[767px]:h-[22px] max-[767px]:text-[8px] font-semibold text-white">
            {multiplier.toFixed(2)}x
          </div>
        </div>
      ))}
    </div>
  );
}

function KenoHitPulseBorder() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-[-3px] z-20 animate-[keno-hit-border-pulse_1s_ease-in-out_infinite] rounded-[14px] border-2 border-[#43f785]"
    />
  );
}
function KenoMissCorners() {
  const cornerClassName =
    "absolute z-20 h-2.5 w-2.5 border-[var(--color-brand-hover)]";

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <span
        className={`${cornerClassName} right-1 top-1 rounded-tr-[3px] border-r-2 border-t-2`}
      />
      <span
        className={`${cornerClassName} bottom-1 left-1 rounded-bl-[3px] border-b-2 border-l-2`}
      />
    </span>
  );
}

function KenoSmallGem() {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="drop-shadow-[0_0_8px_rgb(109_243_155/70%)] max-[767px]:size-3"
      height={16}
      src="/icon-diamond.svg"
      width={16}
    />
  );
}

function KenoDiamond() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 z-0 grid place-items-center bg-[radial-gradient(circle,rgb(74_222_128/38%)_0%,rgb(74_222_128/0)_68%)]"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="drop-shadow-[0_0_18px_rgb(74_222_128/85%)] max-[767px]:size-7"
        height={44}
        src="/icon-diamond.svg"
        width={44}
      />
    </span>
  );
}
