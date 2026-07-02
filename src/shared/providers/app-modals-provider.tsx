"use client";

import { AuthModal } from "@/features/auth";
import { PointsExchangeModal } from "@/features/points-exchange";
import { ProvablyFairModal } from "@/features/provably-fair";

export function AppModalsProvider() {
  return (
    <>
      <AuthModal />
      <PointsExchangeModal />
      <ProvablyFairModal />
    </>
  );
}
