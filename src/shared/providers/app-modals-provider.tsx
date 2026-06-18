"use client";

import { AuthModal } from "@/features/auth";
import { ProvablyFairModal } from "@/features/provably-fair";

export function AppModalsProvider() {
  return (
    <>
      <AuthModal />
      <ProvablyFairModal />
    </>
  );
}
