"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";
import avatarProfile from "@/assets/shared/avatarProfile.svg";
import { HeaderProfileDropdown } from "./header-profile-dropdown";

type HeaderProfileMenuProps = {
  isLogoutPending: boolean;
  username: string;
  onLogout: () => void;
};

export function HeaderProfileMenu({
  isLogoutPending,
  username,
  onLogout,
}: HeaderProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="relative shrink-0"
      ref={containerRef}
    >
      <button
        aria-expanded={isOpen}
        aria-label="Open profile dropdown"
        className="flex h-10 cursor-pointer items-center gap-2 text-[16px] leading-[125%] font-normal text-[#fdfdfd] transition hover:text-white max-tablet:text-[13px]"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--color-brand)] ring-2 ring-[var(--color-brand)]">
          <Image
            alt=""
            aria-hidden="true"
            className="size-10 object-cover"
            height={40}
            src={avatarProfile}
            width={40}
          />
        </span>
        <span className="max-w-[160px] truncate">{username}</span>
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

      {isOpen ? (
        <HeaderProfileDropdown
          isLogoutPending={isLogoutPending}
          onLogout={onLogout}
        />
      ) : null}
    </div>
  );
}
