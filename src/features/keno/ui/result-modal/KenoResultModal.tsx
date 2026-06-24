import Image from "next/image";
import coinIcon from "@/assets/BetCointIcon.svg";
import gobletIcon from "@/assets/games/roulette/whiteGoblet.svg";
import type { KenoBetResponse } from "../../api/keno-types";
import { formatKenoAmount } from "../../lib/keno-format";

type KenoResultModalProps = {
  hitCount: number;
  result: KenoBetResponse;
  onClose: () => void;
};

export function KenoResultModal({
  hitCount,
  onClose,
  result,
}: KenoResultModalProps) {
  return (
    <button
      aria-label="Close Keno result"
      className="absolute inset-0 z-30 grid cursor-default place-items-center bg-black/35"
      onClick={onClose}
      type="button"
    >
      <div
        aria-live="polite"
        className="h-[166px] w-[272px] overflow-hidden rounded-[14px] border border-[#334050] bg-[#202731] text-[var(--color-text-primary)] shadow-[0_18px_50px_rgb(0_0_0/45%)]"
        role="status"
      >
        <div className="flex h-[74px] items-center justify-center gap-3 border-b border-[#334050] bg-[linear-gradient(180deg,#252c37_0%,#202731_100%)] px-5">
          <Image alt="" className="h-6 w-6" src={gobletIcon} />
          <span className="text-[24px] font-semibold leading-none">
            {result.multiplier.toFixed(2)}x
          </span>
        </div>

        <div className="flex h-[92px] items-center justify-between px-7">
          <span className="flex min-w-0 items-center gap-2 text-[24px] font-semibold leading-none">
            <Image alt="" className="h-6 w-6 shrink-0" src={coinIcon} />
            <span className="truncate">{formatKenoAmount(result.payout)}</span>
          </span>

          <span className="flex shrink-0 items-center gap-2 text-[22px] font-semibold leading-none">
            <Image
              alt=""
              aria-hidden="true"
              className="drop-shadow-[0_0_8px_rgb(109_243_155/70%)]"
              height={24}
              src="/icon-diamond.svg"
              width={24}
            />
            <span>{hitCount}x</span>
          </span>
        </div>
      </div>
    </button>
  );
}
