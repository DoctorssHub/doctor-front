"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { GameMode, Risk } from "@/entities/game/model/types";
import type { BetAmountControl } from "@/widgets/game-sidebar/lib/bet-amount-controls";

type GameSidebarProps = {
  autoBetsAmount: string;
  balanceLabel?: string;
  betAmount: string;
  betButtonLabel?: string;
  errorMessage?: string;
  isAutoBetsInfinite: boolean;
  isBetDisabled?: boolean;
  isModeChangeDisabled?: boolean;
  isRiskChangeDisabled?: boolean;
  isRowsChangeDisabled?: boolean;
  maxBet?: string;
  minBet?: string;
  mode: GameMode;
  onAutoBetsAmountChange: (amount: string) => void;
  onAutoBetsInfinityToggle: () => void;
  onBetAmountChange: (amount: string) => void;
  onBetAmountBlur: () => void;
  onBetAmountControlClick: (control: BetAmountControl) => void;
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
  autoBetsAmount,
  balanceLabel,
  betAmount,
  betButtonLabel = "Bet",
  errorMessage,
  isAutoBetsInfinite,
  isBetDisabled = false,
  isModeChangeDisabled = false,
  isRiskChangeDisabled = false,
  isRowsChangeDisabled = false,
  maxBet,
  minBet,
  mode,
  onAutoBetsAmountChange,
  onAutoBetsInfinityToggle,
  onBetAmountBlur,
  onBetAmountChange,
  onBetAmountControlClick,
  onBetClick,
  onModeChange,
  onRiskChange,
  onRowsChange,
  risk,
  rows,
}: GameSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#0E121C] px-5 py-6 min-[1024px]:w-[330px] min-[1024px]:px-7 max-[1023px]:order-2 max-[1023px]:border-t max-[1023px]:border-[#111827] max-[767px]:px-4 max-[767px]:py-5">
      <div className="grid grid-cols-2 gap-3 rounded-lg max-[1023px]:order-7 max-[1023px]:mt-6">
        {(["Manual", "Auto"] as const).map((nextMode) => (
          <button
            className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
              mode === nextMode
                ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)] text-white"
                : "text-white/70 hover:bg-[#171d29]"
            } disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isModeChangeDisabled}
            key={nextMode}
            onClick={() => onModeChange(nextMode)}
            type="button"
          >
            {nextMode}
          </button>
        ))}
      </div>

      <div className="mt-8 max-[1023px]:order-3 max-[1023px]:mt-5 max-[767px]:mt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-white" htmlFor="bet">
            Bet Amount
          </label>
          {balanceLabel ? (
            <span className="hidden items-center gap-1 text-xs font-semibold text-white/75 max-[1023px]:flex">
              <Image
                src="/red-coin.svg"
                alt=""
                width={14}
                height={14}
                className="size-3.5"
                aria-hidden="true"
              />
              {balanceLabel}
            </span>
          ) : null}
        </div>
        <div className="flex h-10 items-center rounded-md border border-[#1B1F26] bg-[#1B1F2640] px-3">
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
            max={maxBet}
            min={minBet}
            onBlur={onBetAmountBlur}
            onChange={(event) => onBetAmountChange(event.target.value)}
            placeholder={minBet ? `Min ${minBet}` : undefined}
            type="number"
            value={betAmount}
          />
          <div className="ml-2 flex gap-1">
            {(
              [
                ["half", "1/2"],
                ["double", "2x"],
                ["max", "MAX"],
              ] as const
            ).map(([control, label]) => (
              <button
                className="h-6 rounded bg-[#1B1F26] border border-[#3F4A5980] px-2 text-[10px] font-semibold text-white/45 transition hover:text-white"
                key={control}
                onClick={() => onBetAmountControlClick(control)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <fieldset className="mt-6 max-[1023px]:order-4 max-[1023px]:mt-5">
        <legend className="mb-3 text-sm font-semibold text-white">Risk</legend>
        <div className="grid grid-cols-3 gap-3">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((nextRisk) => (
            <button
              className={`h-10 rounded-md text-sm font-semibold transition ${
                risk === nextRisk
                  ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)]"
                  : "hover:bg-[#171d29]"
              } ${riskTone[nextRisk]} disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={isRiskChangeDisabled}
              key={nextRisk}
              onClick={() => onRiskChange(nextRisk)}
              type="button"
            >
              {riskLabels[nextRisk]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 max-[1023px]:order-5 max-[1023px]:mt-5">
        <label
          className="mb-2 block text-sm font-semibold text-white"
          htmlFor="rows"
        >
          Rows
        </label>
        <div className="flex items-center gap-3">
          <span className="w-4 text-sm font-semibold text-white">{rows}</span>
          <input
            className="plinko-rows-range h-1 flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRowsChangeDisabled}
            id="rows"
            max={16}
            min={8}
            onChange={(event) => onRowsChange(Number(event.target.value))}
            style={
              {
                "--plinko-rows-progress": `${((rows - 8) / 8) * 100}%`,
              } as CSSProperties
            }
            type="range"
            value={rows}
          />
        </div>
      </div>

      {mode === "Auto" ? (
        <label
          className="mt-6 block text-sm font-semibold text-white max-[1023px]:order-6 max-[1023px]:mt-5"
          htmlFor="auto-bets"
        >
          Number of Bets
          <span className="mt-2 flex items-center gap-2">
            <span className="flex h-7 min-w-0 flex-1 items-center rounded-md border border-[#202938] bg-[#1B1F2640] px-3">
              {isAutoBetsInfinite ? (
                <span className="flex flex-1 items-center justify-start">
                  <Image
                    src="/infinity-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>
              ) : (
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                  id="auto-bets"
                  inputMode="numeric"
                  min={1}
                  onChange={(event) =>
                    onAutoBetsAmountChange(event.target.value)
                  }
                  type="number"
                  value={autoBetsAmount}
                />
              )}
              <button
                aria-pressed={isAutoBetsInfinite}
                aria-label="Toggle infinite autobet"
                className={`ml-2 flex size-5 shrink-0 items-center justify-center rounded border border-[#3F4A5980] transition hover:bg-[#1b2230] ${
                  isAutoBetsInfinite ? "bg-[#1b2230]" : "bg-transparent"
                }`}
                onClick={onAutoBetsInfinityToggle}
                type="button"
              >
                <Image
                  src="/infinity-icon.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5"
                  aria-hidden="true"
                />
              </button>
            </span>
          </span>
        </label>
      ) : null}

      <button
        className="mt-8 h-12 rounded-md bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60 max-[1023px]:order-1 max-[1023px]:mt-0"
        disabled={isBetDisabled}
        onClick={onBetClick}
        type="button"
      >
        {betButtonLabel}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-sm leading-5 text-[#f87171] max-[1023px]:order-2">
          {errorMessage}
        </p>
      ) : null}
    </aside>
  );
}
