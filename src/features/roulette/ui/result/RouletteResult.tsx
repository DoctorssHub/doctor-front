import type { RouletteResult as RouletteResultValue } from "../../model/use-roulette-store";

type RouletteResultProps = {
  result: RouletteResultValue | null;
};

export function RouletteResult({ result }: RouletteResultProps) {
  if (!result) {
    return null;
  }

  const isWin = Number(result.payout) > 0 || result.multiplier > 0;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-[var(--color-text-subtle)]">
            Result
          </p>
          <p className="text-xl font-bold">
            {isWin ? "Win" : "Lose"} on {result.number}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-right text-xs sm:min-w-[320px]">
          <div>
            <p className="text-[var(--color-text-subtle)]">Bet</p>
            <p className="font-bold">{result.betSize}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-subtle)]">Payout</p>
            <p className="font-bold">{result.payout}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-subtle)]">Multiplier</p>
            <p className="font-bold">{result.multiplier}x</p>
          </div>
        </div>
      </div>
    </div>
  );
}
