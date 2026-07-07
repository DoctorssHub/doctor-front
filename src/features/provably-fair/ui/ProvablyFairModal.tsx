"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import closeIcon from "@/assets/games/provably-fair/closeIcon.svg";
import { getModalPortalTarget } from "../lib/modal-portal-target";
import type { ProvablyFairGame } from "../model/provably-fair-games";
import { useProvablyFairModalStore } from "../model/provably-fair-modal-store";
import { ProvablyFairTabs } from "./ProvablyFairTabs";
import { SeedsTab } from "./SeedsTab";
import { VerifyTab } from "./VerifyTab";

type FairnessTab = "seeds" | "verify";

export function ProvablyFairModal() {

  const isOpen = useProvablyFairModalStore((state) => state.isOpen);
  const openKey = useProvablyFairModalStore((state) => state.openKey);
  const initialGame = useProvablyFairModalStore((state) => state.initialGame);
  const closeProvablyFairModal = useProvablyFairModalStore(
    (state) => state.closeProvablyFairModal,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ProvablyFairModalContent
      initialGame={initialGame}
      key={openKey}
      onClose={closeProvablyFairModal}
    />
  );
}

type ProvablyFairModalContentProps = {
  initialGame: ProvablyFairGame;
  onClose: () => void;
};

function ProvablyFairModalContent({
  initialGame,
  onClose,
}: ProvablyFairModalContentProps) {

  const [activeTab, setActiveTab] = useState<FairnessTab>("seeds");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-[var(--color-auth-backdrop)]/80 p-3 pt-6 text-[var(--color-text-primary)] backdrop-blur-sm tablet:pt-8">
      <section
        aria-label="Fairness"
        aria-modal="true"
        className="relative top-[50px] w-full max-w-[704px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-page-raised)] px-5 py-8 shadow-[var(--shadow-auth-modal)] tablet:px-10"
        role="dialog"
      >
        <button
          aria-label="Close fairness"
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-lg text-2xl leading-none text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-hover)]"
          onClick={() => {
            onClose();
          }}
          type="button"
        >
          <Image alt="" height={16} src={closeIcon} width={16} />
        </button>

        <h2 className="mb-7 text-center text-2xl font-bold">Fairness</h2>

        <div className="space-y-7">
          <ProvablyFairTabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
            }}
          />

          <div className="grid">
            <div
              aria-hidden={activeTab !== "seeds"}
              className={[
                "col-start-1 row-start-1 transition-[opacity,transform] duration-200 ease-out",
                activeTab === "seeds"
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0",
              ].join(" ")}
              inert={activeTab !== "seeds"}
            >
              <SeedsTab />
            </div>
            <div
              aria-hidden={activeTab !== "verify"}
              className={[
                "col-start-1 row-start-1 transition-[opacity,transform] duration-200 ease-out",
                activeTab === "verify"
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0",
              ].join(" ")}
              inert={activeTab !== "verify"}
            >
              <VerifyTab initialGame={initialGame} />
            </div>
          </div>
        </div>
      </section>
    </div>,
    getModalPortalTarget(document),
  );
}
