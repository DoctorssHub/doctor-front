import type { ReactNode } from "react";
import type { HoverHandlers } from "../betting-board-types";
import { PlacedChip } from "../PlacedChip";
import { mobileButtonStateClass } from "./mobile-betting-board-utils";

type MobileBetButtonProps = {
  amount?: number;
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  disabled: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onHoverHandlers: HoverHandlers;
};

export function MobileBetButton({
  amount,
  ariaLabel,
  children,
  className = "",
  disabled,
  isHighlighted,
  onClick,
  onHoverHandlers,
}: MobileBetButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={[
        "relative grid place-items-center rounded-[4px] border text-center text-[10px] font-semibold leading-[120%] text-[var(--color-text-primary)] transition disabled:opacity-60",
        mobileButtonStateClass(isHighlighted),
        className,
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...onHoverHandlers}
    >
      {children}
      {amount ? <PlacedChip amount={amount} /> : null}
    </button>
  );
}
