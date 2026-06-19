"use client";

import { useAuthModalStore, useAuthSessionStore } from "@/features/auth";
import { Button } from "@/shared/ui/button";

export function HeroRegisterButton() {
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);
  const isAuthenticated = useAuthSessionStore(
    (state) => state.isAuthenticated,
  );

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button
      className="mt-8 cursor-pointer text-[18px] font-medium max-tablet:mt-6 max-tablet:text-[16px]"
      type="button"
      onClick={() => openAuthModal("register")}
    >
      Register
    </Button>
  );
}
