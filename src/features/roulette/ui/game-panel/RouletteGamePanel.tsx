import type {
  NewRouletteBet,
  PlacedRouletteBet,
} from "../../model/roulette-bets";
import type { RouletteResult as RouletteResultValue } from "../../model/use-roulette-store";
import { BettingBoard } from "../betting-board";
import { RouletteHistory } from "../history";
import { RouletteWheel } from "../roulette-wheel";
import { RouletteWinModal } from "../win-modal";

type RouletteGamePanelProps = {
  canUndo: boolean;
  disabled: boolean;
  isFullscreen?: boolean;
  isResultAnimating: boolean;
  isWinModalVisible: boolean;
  isWheelSpinning: boolean;
  placedBets: PlacedRouletteBet[];
  result: RouletteResultValue | null;
  resultHistory: RouletteResultValue[];
  onLandingComplete: () => void;
  onClear: () => void;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onSettleResultHistory: () => void;
  onUndo: () => void;
};

export function RouletteGamePanel({
  canUndo,
  disabled,
  isFullscreen = false,
  isResultAnimating,
  isWinModalVisible,
  isWheelSpinning,
  placedBets,
  result,
  resultHistory,
  onLandingComplete,
  onClear,
  onPlaceBet,
  onSettleResultHistory,
  onUndo,
}: RouletteGamePanelProps) {
  const winResult =
    result && isWinModalVisible && !isResultAnimating && Number(result.payout) > 0
      ? result
      : null;
  const isMobileWheelOverlayVisible = isWheelSpinning || isResultAnimating;

  return (
    <section
      className={[
        "relative flex min-w-0 flex-col gap-7 border-b-2 border-r-2 border-[var(--color-surface)] bg-[linear-gradient(180deg,#10151F_0%,#10151F_55%,#3A170D_100%)] px-[10px] pb-[30px] pt-5 max-laptop:order-1 max-laptop:border-0 max-laptop:pb-0 tablet:max-laptop:px-0 max-tablet:gap-5 max-tablet:px-0 max-tablet:pt-0 laptop:w-full laptop:rounded-[0_16px_16px_0]",
        isFullscreen
          ? "justify-start laptop:h-full"
          : "justify-between laptop:h-[668px]",
      ].join(" ")}
    >
      <RouletteHistory
        results={resultHistory}
        onExitComplete={onSettleResultHistory}
      />

      <div
        className={[
          "relative mx-auto w-full max-w-[560px]",
          isMobileWheelOverlayVisible
            ? "max-tablet:fixed max-tablet:inset-0 max-tablet:z-30 max-tablet:flex max-tablet:max-w-none max-tablet:items-center max-tablet:justify-center max-tablet:bg-[var(--color-roulette-win-backdrop)] max-tablet:backdrop-blur-[2px]"
            : "max-tablet:hidden",
        ].join(" ")}
      >
        <RouletteWheel
          isSpinning={isWheelSpinning}
          onLandingComplete={onLandingComplete}
          resultNumber={result?.number ?? null}
        />
      </div>

      <div className="space-y-4">
        <BettingBoard
          canUndo={canUndo}
          disabled={disabled}
          isFullscreen={isFullscreen}
          placedBets={placedBets}
          onClear={onClear}
          onPlaceBet={onPlaceBet}
          onUndo={onUndo}
        />
      </div>

      {winResult ? (
        <>
          <div className="absolute inset-0 z-20 bg-[var(--color-roulette-win-backdrop)] backdrop-blur-[4px] lg:rounded-[0_16px_16px_0]" />
          <RouletteWinModal result={winResult} />
        </>
      ) : null}
    </section>
  );
}
