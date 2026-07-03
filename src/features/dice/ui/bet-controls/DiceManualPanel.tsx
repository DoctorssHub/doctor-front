import Image from "next/image";
import redCoinIcon from "@/assets/shared/red-coin.svg";

type DiceManualPanelProps = {
  profitOnWin: string;
};

export function DiceManualPanel({ profitOnWin }: DiceManualPanelProps) {
  return (
    <div className="dice-mode-panel mt-5" key="dice-manual-panel">
      <label
        className="mb-2 block text-sm font-semibold text-white"
        htmlFor="dice-profit-on-win"
      >
        Profit on Win
      </label>
      <div className="flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3">
        <Image
          src={redCoinIcon}
          alt=""
          width={16}
          height={16}
          className="mr-2"
          aria-hidden="true"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white/55 outline-none"
          id="dice-profit-on-win"
          readOnly
          type="text"
          value={profitOnWin}
        />
      </div>
    </div>
  );
}
