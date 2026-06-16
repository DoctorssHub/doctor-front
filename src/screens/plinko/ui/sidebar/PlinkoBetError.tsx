"use client";

import { usePlinkoBettingStore } from "@/features/plinko/model/plinko-betting-store";
import type { PlinkoSidebarProps } from "../PlinkoSidebar";

export function PlinkoBetError({
  configErrorMessage,
}: Pick<PlinkoSidebarProps, "configErrorMessage">) {
  const betValidationError = usePlinkoBettingStore(
    (state) => state.betValidationError,
  );
  const errorMessage = betValidationError || configErrorMessage;

  return errorMessage ? (
    <p className="mt-3 text-sm leading-5 text-[#f87171] max-laptop:order-2">
      {errorMessage}
    </p>
  ) : null;
}
