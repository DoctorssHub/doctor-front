import { memo } from "react";
import Image, { type ImageProps } from "next/image";
import infinityIcon from "@/assets/shared/infinity-icon.svg";

type AutoBetControlsProps = {
  autoBetsAmount: string;
  buttonClassName?: string;
  className?: string;
  fieldClassName?: string;
  id?: string;
  infinityIconSrc?: ImageProps["src"];
  inputClassName?: string;
  inputMode?: "decimal" | "numeric";
  inputPattern?: string;
  inputType?: "number" | "text";
  isAutoBetsInfinite: boolean;
  isDisabled?: boolean;
  isInputDisabled?: boolean;
  label?: string;
  labelClassName?: string;
  onAutoBetsAmountChange: (amount: string) => void;
  onAutoBetsInfinityToggle: () => void;
};

export const AutoBetControls = memo(function AutoBetControls({
  autoBetsAmount,
  buttonClassName,
  className = "mt-6 block text-sm font-semibold text-white max-[1023px]:order-6 max-[1023px]:mt-5",
  fieldClassName,
  id = "auto-bets",
  infinityIconSrc = infinityIcon,
  inputClassName,
  inputMode = "numeric",
  inputPattern,
  inputType = "number",
  isAutoBetsInfinite,
  isDisabled = false,
  isInputDisabled = false,
  label = "Number of Bets",
  labelClassName,
  onAutoBetsAmountChange,
  onAutoBetsInfinityToggle,
}: AutoBetControlsProps) {
  const isAmountInputDisabled =
    isDisabled || isInputDisabled || isAutoBetsInfinite;

  return (
    <label
      className={className}
      htmlFor={id}
    >
      <span className={labelClassName}>{label}</span>
      <span className="mt-2 flex items-center gap-2">
        <span
          className={[
            "flex h-7 min-w-0 flex-1 items-center rounded-md border border-[#202938] bg-[#1B1F2640] px-3 transition",
            fieldClassName,
            isDisabled ? "opacity-60" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isAutoBetsInfinite ? (
            <span className="flex flex-1 items-center justify-start">
              <Image
                src={infinityIconSrc}
                alt=""
                width={16}
                height={16}
                className="size-4"
                aria-hidden="true"
              />
            </span>
          ) : (
            <input
              className={[
                "min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed",
                inputClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={isAmountInputDisabled}
              id={id}
              inputMode={inputMode}
              min={1}
              onChange={(event) => onAutoBetsAmountChange(event.target.value)}
              pattern={inputPattern}
              type={inputType}
              value={autoBetsAmount}
            />
          )}
          <button
            aria-pressed={isAutoBetsInfinite}
            aria-label="Toggle infinite autobet"
            className={[
              "ml-2 flex size-5 shrink-0 items-center justify-center rounded border border-[#3F4A5980] transition hover:bg-[#1b2230] disabled:cursor-not-allowed",
              isAutoBetsInfinite ? "bg-[#1b2230]" : "bg-transparent",
              buttonClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={isDisabled}
            onClick={onAutoBetsInfinityToggle}
            type="button"
          >
            <Image
              src={infinityIconSrc}
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
  );
});
