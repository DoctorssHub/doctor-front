import Image from "next/image";
import coinIcon from "@/assets/shared/red-coin.svg";
import gobletIcon from "@/assets/games/roulette/whiteGoblet.svg";
import { ROULETTE_RED_NUMBERS } from "../../model/roulette-constants";
import type { RouletteResult } from "../../model/use-roulette-store";

type RouletteWinModalProps = {
  result: RouletteResult;
};

function getWinningNumberClass(number: number) {
  if (number === 0) {
    return "bg-[var(--color-roulette-green)]";
  }

  if (ROULETTE_RED_NUMBERS.has(number)) {
    return "bg-[var(--color-roulette-red)]";
  }

  return "bg-[image:var(--gradient-roulette-dark-cell)]";
}

export function RouletteWinModal({ result }: RouletteWinModalProps) {
  return (
    <div
      aria-live="polite"
      className="absolute left-1/2 top-1/2 z-30 h-[116px] w-[190px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[12px] text-[var(--color-text-primary)]"
      role="status"
    >
      <div className="flex h-[52px] w-[190px] items-center justify-center gap-2 rounded-[12px_12px_0_0] border border-[var(--color-roulette-win-border)] bg-[image:var(--gradient-roulette-win-header)] px-4 py-3">
        <Image alt="" className="h-5 w-5" src={gobletIcon} />
        <span className="text-[16px] font-semibold leading-[129%]">
          {result.multiplier.toFixed(2)}x
        </span>
      </div>

      <div className="flex h-[64px] w-[190px] items-center justify-between rounded-[0_0_12px_12px] bg-[image:var(--gradient-roulette-win-body)] p-4">
        <span className="flex min-w-0 items-center gap-2 text-[16px] font-semibold leading-[129%]">
          <Image alt="" className="h-5 w-5 shrink-0" src={coinIcon} />
          <span className="truncate">{result.payout}</span>
        </span>

        <span
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-[4px] text-center text-[14px] font-semibold leading-[129%]",
            getWinningNumberClass(result.number),
          ].join(" ")}
        >
          {result.number}
        </span>
      </div>
    </div>
  );
}
