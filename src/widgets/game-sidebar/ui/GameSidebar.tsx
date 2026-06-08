"use client";

import Image from "next/image";
import type { GameMode, Risk } from "@/entities/game/model/types";

type GameSidebarProps = {
  balance: string;
  betAmount: string;
  mode: GameMode;
  onBetAmountChange: (amount: string) => void;
  onBetClick: () => void;
  onModeChange: (mode: GameMode) => void;
  onRiskChange: (risk: Risk) => void;
  onRowsChange: (rows: number) => void;
  risk: Risk;
  rows: number;
};

const riskLabels: Record<Risk, string> = {
  HIGH: "High",
  LOW: "Low",
  MEDIUM: "Medium",
};

const riskTone: Record<Risk, string> = {
  HIGH: "text-[#ef4444]",
  LOW: "text-[#22c55e]",
  MEDIUM: "text-[#facc15]",
};

export function GameSidebar({
  balance,
  betAmount,
  mode,
  onBetAmountChange,
  onBetClick,
  onModeChange,
  onRiskChange,
  onRowsChange,
  risk,
  rows,
}: GameSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#0E121C] px-5 py-6 md:w-75 md:px-7">
      <div className="grid grid-cols-2 gap-3 rounded-lg">
        {(["Manual", "Auto"] as const).map((nextMode) => (
          <button
            className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
              mode === nextMode
                ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)] text-white"
                : "text-white/70 hover:bg-[#171d29]"
            }`}
            key={nextMode}
            onClick={() => onModeChange(nextMode)}
            type="button"
          >
            {nextMode}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-white" htmlFor="bet">
            Bet Amount
          </label>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Image
              src="/red-coin.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <span>{balance}</span>
          </div>
        </div>
        <div className="flex h-10 items-center rounded-md border border-[#202938] bg-[#0d1320] px-3">
          <Image
            src="/red-coin.svg"
            alt=""
            width={16}
            height={16}
            className="mr-2"
            aria-hidden="true"
          />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
            id="bet"
            inputMode="decimal"
            onChange={(event) => onBetAmountChange(event.target.value)}
            value={betAmount}
          />
          <div className="ml-2 flex gap-1">
            {["1/2", "2x", "MAX"].map((control) => (
              <button
                className="h-6 rounded bg-[#1b2230] px-2 text-[10px] font-semibold text-white/45 transition hover:text-white"
                key={control}
                type="button"
              >
                {control}
              </button>
            ))}
          </div>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-white">Risk</legend>
        <div className="grid grid-cols-3 gap-3">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((nextRisk) => (
            <button
              className={`h-10 rounded-md text-sm font-semibold transition ${
                risk === nextRisk ? "bg-[#1b2230]" : "hover:bg-[#171d29]"
              } ${riskTone[nextRisk]}`}
              key={nextRisk}
              onClick={() => onRiskChange(nextRisk)}
              type="button"
            >
              {riskLabels[nextRisk]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label
          className="mb-2 block text-sm font-semibold text-white"
          htmlFor="rows"
        >
          Rows
        </label>
        <div className="flex items-center gap-3">
          <span className="w-4 text-sm font-semibold text-white">{rows}</span>
          <input
            className="h-1 flex-1 accent-[#c82831]"
            id="rows"
            max={16}
            min={8}
            onChange={(event) => onRowsChange(Number(event.target.value))}
            type="range"
            value={rows}
          />
        </div>
      </div>

      <button
        className="mt-8 h-12 rounded-md bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43]"
        onClick={onBetClick}
        type="button"
      >
        Bet
      </button>
    </aside>
  );
}
