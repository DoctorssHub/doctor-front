import { memo } from "react";
import Image from "next/image";
import coinIcon from "@/assets/shared/red-coin.svg";
import kenoDiamondIcon from "@/assets/games/keno/diamond.svg";
import gobletIcon from "@/assets/games/roulette/whiteGoblet.svg";
import type { KenoBetResponse } from "../../api/keno-types";
import { formatKenoAmount } from "../../lib/keno-format";

const resultHeaderClassName = {
  loss: "border-b border-[#334050] bg-[linear-gradient(180deg,#252c37_0%,#202731_100%)]",
  win: "bg-[linear-gradient(rgb(10,39,26)_0%,rgb(57,177,125)_100%)] shadow-[inset_0_-1px_0_rgb(255_255_255/12%)]",
};

type KenoResultModalProps = {
  hitCount: number;
  result: KenoBetResponse;
  onClose: () => void;
};

export const KenoResultModal = memo(function KenoResultModal({
  hitCount,
  onClose,
  result,
}: KenoResultModalProps) {
  const resultState = Number(result.payout) > 0 ? "win" : "loss";

  return (
    <button
      aria-label="Close Keno result"
      className="absolute inset-0 z-30 grid cursor-default place-items-center bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
      type="button"
    >
      <div
        aria-live="polite"
        className="h-[114px] w-[184px] overflow-hidden rounded-[9px] border border-[#334050] bg-[#202731] text-[var(--color-text-primary)] shadow-[0_18px_50px_rgb(0_0_0/45%)] min-[768px]:h-[166px] min-[768px]:w-[272px] min-[768px]:rounded-[14px]"
        role="status"
      >
        <div
          className={`flex h-[51px] items-center justify-center gap-2 px-4 min-[768px]:h-[74px] min-[768px]:gap-3 min-[768px]:px-5 ${resultHeaderClassName[resultState]}`}
        >
          <Image alt="" className="size-4 min-[768px]:size-6" src={gobletIcon} />
          <span className="text-[16px] font-semibold leading-none min-[768px]:text-[24px]">
            {result.multiplier.toFixed(2)}x
          </span>
        </div>

        <div className="flex h-[63px] items-center justify-between px-5 min-[768px]:h-[92px] min-[768px]:px-7">
          <span className="flex min-w-0 items-center gap-1.5 text-[16px] font-semibold leading-none min-[768px]:gap-2 min-[768px]:text-[24px]">
            <Image alt="" className="size-4 shrink-0 min-[768px]:size-6" src={coinIcon} />
            <span className="truncate">{formatKenoAmount(result.payout)}</span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5 text-[14px] font-semibold leading-none min-[768px]:gap-2 min-[768px]:text-[22px]">
            <Image
              alt=""
              aria-hidden="true"
              className="size-4 drop-shadow-[0_0_8px_rgb(109_243_155/70%)] min-[768px]:size-6"
              src={kenoDiamondIcon}
            />
            <span>{hitCount}x</span>
          </span>
        </div>
      </div>
    </button>
  );
});
