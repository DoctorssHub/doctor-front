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
  disabled: boolean;
  isResultAnimating: boolean;
  isWinModalVisible: boolean;
  isWheelSpinning: boolean;
  placedBets: PlacedRouletteBet[];
  result: RouletteResultValue | null;
  resultHistory: RouletteResultValue[];
  onLandingComplete: () => void;
  onPlaceBet: (bet: NewRouletteBet) => void;
  onSettleResultHistory: () => void;
};

export function RouletteGamePanel({
  disabled,
  isResultAnimating,
  isWinModalVisible,
  isWheelSpinning,
  placedBets,
  result,
  resultHistory,
  onLandingComplete,
  onPlaceBet,
  onSettleResultHistory,
}: RouletteGamePanelProps) {
  const winResult =
    result && isWinModalVisible && !isResultAnimating && Number(result.payout) > 0
      ? result
      : null;

  return (
    <section className="relative flex min-w-0 flex-col justify-between gap-7 border-b-2 border-r-2 border-[var(--color-surface)] bg-[var(--color-roulette-panel)] px-[10px] pb-[30px] pt-5 lg:h-[668px] lg:w-[665px] lg:rounded-[0_16px_16px_0]">
      <RouletteHistory
        results={resultHistory}
        onExitComplete={onSettleResultHistory}
      />

      <div className="relative mx-auto w-full max-w-[560px]">
        <RouletteWheel
          isSpinning={isWheelSpinning}
          onLandingComplete={onLandingComplete}
          resultNumber={result?.number ?? null}
        />
      </div>

      <div className="space-y-4">
        <BettingBoard
          disabled={disabled}
          placedBets={placedBets}
          onPlaceBet={onPlaceBet}
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
