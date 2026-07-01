"use client";

import ClaimBg from "@/assets/aside/claim-bg.png";
import Image from "next/image";
import { memo } from "react";

import { DailyClaimButton } from "./DailyClaimButton";
import type { ClaimCardProps } from "./types";

export const ClaimCard = memo(function ClaimCard({
  isCollapsed = false,
}: ClaimCardProps) {
  if (isCollapsed) {
    return <DailyClaimButton isCollapsed />;
  }

  return (
    <div className="relative max-tablet:h-[124px] max-tablet:w-[327px]">
      <Image
        alt="Daily claimer reward background"
        className="max-tablet:h-full max-tablet:w-full max-tablet:object-cover"
        src={ClaimBg}
      />
      <div className="absolute top-0 flex h-full flex-col justify-between p-3">
        <h3 className="text-[16px] font-semibold text-(--color-text-primary)">
          DAILY <br /> CLAIMER!
        </h3>
        <DailyClaimButton />
      </div>
    </div>
  );
});
