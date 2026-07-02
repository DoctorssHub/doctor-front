"use client";

import Image from "next/image";
import closeIcon from "@/assets/auth/close-icon.svg";
import twoCoinsImage from "@/assets/header/twoCoins.webp";
import redCoinIcon from "@/assets/shared/red-coin.svg";
import yellowCoinIcon from "@/assets/shared/yellow-coin.svg";
import { ExchangeAmountField } from "./ExchangeAmountField";
import { ExchangeRateCard } from "./ExchangeRateCard";
import { ReadonlyAmountField } from "./ReadonlyAmountField";
import { useModalDismiss } from "./useModalDismiss";
import { usePointsExchangeForm } from "./usePointsExchangeForm";

type PointsExchangeModalContentProps = {
  onClose: () => void;
};

export function PointsExchangeModalContent({
  onClose,
}: PointsExchangeModalContentProps) {
  const form = usePointsExchangeForm({ onClose });
  const handleBackdropClick = useModalDismiss(onClose);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#020511]/80 p-4 text-[#FDFDFD] backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <section
        aria-label="Points exchange"
        aria-modal="true"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-[680px] overflow-y-auto rounded-[24px] bg-[#0A0D19] p-5 shadow-[0_24px_96px_rgba(0,0,0,0.56)] md:p-10"
        role="dialog"
      >
        <button
          aria-label="Close points exchange dialog"
          className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-white/5"
          onClick={onClose}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={20}
            src={closeIcon}
            width={20}
          />
        </button>

        <div className="flex flex-col items-center text-center">
          <Image
            alt="Watch points and game points"
            className="h-[113px] w-[108px] object-contain"
            height={113}
            priority
            src={twoCoinsImage}
            width={108}
          />
          <h2 className="mt-3 text-[20px] leading-tight font-semibold text-[#FDFDFD]">
            Points exchange
          </h2>
          <p className="mt-3 max-w-[460px] text-[16px] leading-[150%] font-semibold text-[#C9CEDA]">
            Convert your Watch Points into Game Points to earn rewards and
            enhance your gameplay.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 max-mobile:grid-cols-1">
          <ExchangeRateCard icon={yellowCoinIcon} label="1 Watch point" />
          <span className="text-[24px] leading-none font-semibold text-[#FDFDFD] max-mobile:text-center">
            =
          </span>
          <ExchangeRateCard icon={redCoinIcon} label="1 Game point" />
        </div>

        <div className="mt-7 space-y-5">
          <ExchangeAmountField
            balance={form.watchPointsValue}
            icon={yellowCoinIcon}
            label="You give"
            value={form.amountValue}
            onChange={form.handleRawAmountChange}
          />
          <ReadonlyAmountField
            balance={form.gamePointsValue}
            icon={redCoinIcon}
            label="You will receive"
            value={form.receivedAmount}
          />
        </div>

        {form.validationErrorMessage ? (
          <p className="mt-4 text-left text-[13px] leading-[140%] font-semibold text-[#FF9AA0]">
            {form.validationErrorMessage}
          </p>
        ) : null}

        <button
          className="mt-6 flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#2A3140] text-[16px] leading-[125%] font-bold text-[#FDFDFD] transition hover:bg-[#343C4F] disabled:cursor-not-allowed disabled:text-[#697386] disabled:hover:bg-[#2A3140]"
          disabled={form.isConfirmDisabled}
          onClick={form.handleConfirm}
          type="button"
        >
          {form.isSubmitting ? "Confirming..." : "Confirm"}
        </button>
      </section>
    </div>
  );
}
