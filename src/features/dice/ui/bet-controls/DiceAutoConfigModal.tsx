"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { DiceAutoConfig } from "../../model/dice-game-options";
import { AutoModeControl } from "./AutoModeControl";
import { CurrencyField } from "./CurrencyField";
import { sanitizeDecimalInput } from "./dice-auto-config-utils";

type DiceAutoConfigModalProps = {
  config: DiceAutoConfig;
  onApply: () => void;
  onChange: (config: DiceAutoConfig) => void;
  onClose: () => void;
  onResetAll: () => void;
};

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
