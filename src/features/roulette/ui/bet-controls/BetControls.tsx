import { useCallback, useState } from "react";
import { AutoBetControls, ModeTabs } from "@/shared/ui/game-sidebar";
import { sanitizeIntegerInput } from "@/shared/ui/game-sidebar/lib/numeric-input";
import { BetSubmitPanel } from "./BetSubmitPanel";
import { ChipPicker } from "./ChipPicker";
import { ManualBetActions } from "./ManualBetActions";

type BetControlsProps = {
  gameBalance: number;
  minBet: number;
  maxBet: number;
  isSpinning: boolean;
  isAutoRunning: boolean;
  isSubmitting: boolean;
  isAnimating: boolean;
  isFullscreen?: boolean;
  isAutoInfinite: boolean;
  errorMessage: string | null;
  onModeChange: (mode: "manual" | "auto") => void;
  onSubmit: () => void;
  onAutoBetCountChange: (value: string) => void;
  onToggleAutoInfinite: () => void;
};

export function BetControls({
  gameBalance,
  minBet,
  maxBet,
  isSpinning,
  isAutoRunning,
  isSubmitting,
  isAnimating,
  isFullscreen = false,
  isAutoInfinite,
  errorMessage,
  onModeChange,
  onSubmit,
  onAutoBetCountChange,
  onToggleAutoInfinite,
}: BetControlsProps) {
  const [mode, setMode] = useState<"manual" | "auto">("manual");
  const [autoBetCount, setAutoBetCount] = useState("10");
  const handleModeChange = useCallback((nextMode: "manual" | "auto") => {
    setMode(nextMode);
    onModeChange(nextMode);
  }, [onModeChange]);
  const handleAutoBetCountChange = useCallback((value: string) => {
    const nextAutoBetCount = sanitizeIntegerInput(value);

    setAutoBetCount(nextAutoBetCount);
    onAutoBetCountChange(nextAutoBetCount);
  }, [onAutoBetCountChange]);

  const isLoading = isSpinning || isSubmitting || isAnimating;
  const controlsDisabled = isAutoRunning || isLoading;

  return (
    <aside
      className={[
        "flex flex-col gap-6 bg-[var(--color-surface)] p-5 text-[var(--color-text-primary)] max-laptop:order-2 max-laptop:bg-transparent max-laptop:px-5 max-laptop:pb-0 max-laptop:pt-6 md:p-6 laptop:w-[352px] laptop:rounded-[16px_0_0_16px]",
        isFullscreen ? "laptop:h-full" : "laptop:h-[668px]",
      ].join(" ")}
    >
      <div className="max-laptop:order-4 laptop:order-1">
        <ModeTabs
          className="grid grid-cols-2 gap-3 rounded-lg text-sm font-semibold"
          isDisabled={controlsDisabled}
          mode={mode}
          options={[
            { label: "Manual", value: "manual" },
            { label: "Auto", value: "auto" },
          ]}
          onModeChange={handleModeChange}
        />
      </div>
      <div className="max-laptop:order-2 laptop:order-2">
        <ChipPicker disabled={controlsDisabled} />
      </div>

      <div className="max-laptop:order-3 laptop:order-3">
        <ManualBetActions
          disabled={controlsDisabled}
          isVisible={mode === "manual"}
        />
        <div
          className={[
            "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
            mode === "auto"
              ? "max-h-[100px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0",
          ].join(" ")}
        >
          <AutoBetControls
            autoBetsAmount={autoBetCount}
            className="block text-sm font-medium text-[var(--color-text-primary)]"
            id="roulette-auto-bet-count"
            inputMode="numeric"
            isAutoBetsInfinite={isAutoInfinite}
            isDisabled={isAutoRunning}
            isInputDisabled={isAutoRunning}
            onAutoBetsAmountChange={handleAutoBetCountChange}
            onAutoBetsInfinityToggle={onToggleAutoInfinite}
          />
        </div>
      </div>

      <div className="max-laptop:order-1 laptop:order-4">
        <BetSubmitPanel
          autoBetCount={autoBetCount}
          errorMessage={errorMessage}
          gameBalance={gameBalance}
          isAutoInfinite={isAutoInfinite}
          isAutoRunning={isAutoRunning}
          isLoading={isLoading}
          maxBet={maxBet}
          minBet={minBet}
          mode={mode}
          onSubmit={onSubmit}
        />
      </div>
    </aside>
  );
}
