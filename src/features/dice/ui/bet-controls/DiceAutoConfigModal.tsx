"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { DiceAutoConfig } from "../../model/use-dice-game";

type DiceAutoConfigModalProps = {
  config: DiceAutoConfig;
  onApply: () => void;
  onChange: (config: DiceAutoConfig) => void;
  onClose: () => void;
  onResetAll: () => void;
};

function sanitizeDecimalInput(value: string) {
  const normalizedValue = value.replace(",", ".");
  const [integerPart = "", ...fractionParts] = normalizedValue
    .replace(/[^\d.]/g, "")
    .split(".");
  const fractionPart = fractionParts.join("");

  return fractionParts.length > 0
    ? `${integerPart}.${fractionPart}`
    : integerPart;
}

export function DiceAutoConfigModal({
  config,
  onApply,
  onChange,
  onClose,
  onResetAll,
}: DiceAutoConfigModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  function updateConfig(nextConfig: Partial<DiceAutoConfig>) {
    onChange({ ...config, ...nextConfig });
  }

  if (typeof document === "undefined") {
    return null;
  }

  const portalTarget = document.fullscreenElement ?? document.body;

  return createPortal(
    <div className="fixed inset-0 z-100 grid place-items-center bg-[#080c17]/70 px-4 backdrop-blur-[2px]">
      <div className="relative h-[588px] w-[550px] rounded-[24px] bg-[#0a0d19] p-10 shadow-[0_24px_80px_rgb(0_0_0/46%)] max-[620px]:h-auto max-[620px]:w-full max-[420px]:p-5">
        <button
          aria-label="Close auto bet configuration"
          className="absolute right-5 top-5 grid size-8 place-items-center text-2xl leading-none text-white transition hover:text-white/70"
          onClick={onClose}
          type="button"
        >
          X
        </button>

        <h2 className="text-center text-xl font-bold text-white">
          Configure Auto-Bet
        </h2>

        <div className="mt-7 space-y-5">
          <AutoModeControl
            increaseValue={config.onWinIncrease}
            label="On Win"
            mode={config.onWinMode}
            onIncreaseChange={(value) =>
              updateConfig({ onWinIncrease: sanitizeDecimalInput(value) })
            }
            onModeChange={(mode) => updateConfig({ onWinMode: mode })}
          />
          <AutoModeControl
            increaseValue={config.onLossIncrease}
            label="On Loss"
            mode={config.onLossMode}
            onIncreaseChange={(value) =>
              updateConfig({ onLossIncrease: sanitizeDecimalInput(value) })
            }
            onModeChange={(mode) => updateConfig({ onLossMode: mode })}
          />
          <CurrencyField
            id="dice-stop-profit"
            label="Stop on Profit"
            value={config.stopOnProfit}
            onChange={(value) =>
              updateConfig({ stopOnProfit: sanitizeDecimalInput(value) })
            }
          />
          <CurrencyField
            id="dice-stop-loss"
            label="Stop on Loss"
            value={config.stopOnLoss}
            onChange={(value) =>
              updateConfig({ stopOnLoss: sanitizeDecimalInput(value) })
            }
          />
        </div>

        <div className="mt-8 space-y-3">
          <button
            className="h-10 w-full rounded-lg bg-[#c82831] text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43]"
            onClick={onApply}
            type="button"
          >
            Apply
          </button>
          <button
            className="h-10 w-full rounded-lg bg-[#252B36] text-sm font-bold text-white transition hover:bg-[#303848]"
            onClick={onResetAll}
            type="button"
          >
            Reset all
          </button>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}

type AutoModeControlProps = {
  increaseValue: string;
  label: string;
  mode: DiceAutoConfig["onWinMode"];
  onIncreaseChange: (value: string) => void;
  onModeChange: (mode: DiceAutoConfig["onWinMode"]) => void;
};

function AutoModeControl({
  increaseValue,
  label,
  mode,
  onIncreaseChange,
  onModeChange,
}: AutoModeControlProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-white">{label}</p>
      <div className="flex h-11 w-[470px] items-center rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 text-xs font-semibold leading-[1.33] text-[#c7cbd4] max-[620px]:w-full">
        <button
          className={`h-7 rounded-[4px] border border-[#1b1f26] px-3 py-1.5 text-[10px] font-semibold leading-none transition ${
            mode === "reset"
              ? "bg-[#c82831] text-[#fff7f7] hover:bg-[#d93a43]"
              : "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-[#c7cbd4] hover:text-white"
          }`}
          onClick={() => onModeChange("reset")}
          type="button"
        >
          Reset
        </button>
        <button
          className={`ml-1 h-7 rounded-[4px] border border-[#1b1f26] px-3 py-1.5 text-[10px] font-semibold leading-none transition ${
            mode === "increase"
              ? "bg-[#c82831] text-[#fff7f7] hover:bg-[#d93a43]"
              : "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-[#c7cbd4] hover:text-white"
          }`}
          onClick={() => onModeChange("increase")}
          type="button"
        >
          Increase By
        </button>
        <input
          aria-label={`${label} increase percent`}
          className="ml-auto w-16 bg-transparent text-right text-xs font-semibold leading-[1.33] text-[#c7cbd4] outline-none"
          inputMode="decimal"
          onChange={(event) => onIncreaseChange(event.target.value)}
          pattern="[0-9]*[.]?[0-9]*"
          type="text"
          value={increaseValue}
        />
        <span className="ml-2 text-xs font-semibold leading-[1.33] text-[#c7cbd4]">
          %
        </span>
      </div>
    </div>
  );
}

type CurrencyFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function CurrencyField({ id, label, value, onChange }: CurrencyFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-bold text-white">{label}</span>
      <span className="flex h-11 w-[470px] items-center rounded-lg border border-[#1b1f26] bg-[#0e121c] p-3 text-xs font-semibold leading-[1.33] text-[#c7cbd4] max-[620px]:w-full">
        <Image
          src="/red-coin.svg"
          alt=""
          width={16}
          height={16}
          className="mr-2"
          aria-hidden="true"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-xs font-semibold leading-[1.33] text-[#c7cbd4] outline-none"
          id={id}
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value)}
          pattern="[0-9]*[.]?[0-9]*"
          type="text"
          value={value}
        />
        <span className="ml-2 text-xs font-semibold leading-[1.33] text-[#c7cbd4]">
          $0.00
        </span>
      </span>
    </label>
  );
}
