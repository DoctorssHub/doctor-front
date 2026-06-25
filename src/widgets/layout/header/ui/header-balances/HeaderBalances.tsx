"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";
import type { UserBalance } from "@/features/auth/lib/read-auth-response";
import { BalanceDropdown } from "./balance-dropdown";
import { BalancePillItem } from "./balance-pill-item";
import { getOrderedBalances } from "./balance-utils";

export function HeaderBalances({ balances }: { balances: UserBalance[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orderedBalances = getOrderedBalances(balances);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        containerRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (balances.length === 0) {
    return null;
  }

  return (
    <div
      className="relative shrink-0"
      ref={containerRef}
    >
      <button
        aria-expanded={isOpen}
        aria-label="Open balance dropdown"
        className="flex h-10 cursor-pointer items-center gap-3 rounded-[6px] bg-[#1b1f26] px-3 py-2 text-[16px] leading-[125%] font-normal text-[#fdfdfd] transition hover:bg-[#202638] max-tablet:gap-2 max-tablet:px-2 max-tablet:text-[13px]"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {orderedBalances.map((balance, index) => (
          <BalancePillItem
            balance={balance}
            isFirst={index === 0}
            key={`${balance.balanceType}-${index}`}
          />
        ))}
        <Image
          alt=""
          aria-hidden="true"
          className={`size-5 shrink-0 transition ${
            isOpen ? "rotate-90" : "-rotate-90"
          }`}
          height={20}
          src={ArrowIcon}
          width={20}
        />
      </button>

      {isOpen ? <BalanceDropdown balances={orderedBalances} /> : null}
    </div>
  );
}
