"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/aside/arrowSidebar.svg";
import { getUsernameInitial } from "@/features/profile/lib/profile-format";
import { HeaderProfileDropdown } from "./header-profile-dropdown";

type HeaderProfileMenuProps = {
  imageUrl: string | null;
  isLogoutPending: boolean;
  username: string;
  onLogout: () => void;
};

export function HeaderProfileMenu({
  imageUrl,
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
    <div className="relative shrink-0" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-label={`Open profile dropdown for ${username}`}
        className="flex h-10 cursor-pointer items-center gap-2 text-[16px] leading-[125%] font-normal text-[#fdfdfd] transition hover:text-white max-tablet:gap-1.5 max-tablet:text-[13px]"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <HeaderAvatar imageUrl={imageUrl} username={username} />
        <span className="max-w-[160px] max-tablet:sr-only">{username}</span>
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
          onItemSelect={() => setIsOpen(false)}
          onLogout={onLogout}
        />
      ) : null}
    </div>
  );
}

function HeaderAvatar({
  imageUrl,
  username,
}: {
  imageUrl: string | null;
  username: string;
}) {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-full p-[2px] max-tablet:size-9"
      style={{
        background:
          "linear-gradient(0deg, #ff3b41 0%, #c82831 45%, #4a0a0d 100%)",
      }}
    >
      <span
        className="flex size-full items-center justify-center overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #3a1417 0%, #1a1016 55%, #120d12 100%)",
        }}
      >
        {imageUrl ? (
          <Image
            alt={`${username} avatar`}
            className="size-full origin-bottom -translate-x-0.5 translate-y-1 scale-110 object-cover"
            height={40}
            src={imageUrl}
            unoptimized
            width={40}
          />
        ) : (
          <span className="text-sm font-bold text-(--color-text-primary)">
            {getUsernameInitial(username)}
          </span>
        )}
      </span>
    </span>
  );
}
