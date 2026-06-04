"use client";

import { useAuthModalStore } from "@/features/auth";

export function HomeScreen() {
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050812] px-6 text-white">
      <button
        className="h-12 rounded-lg bg-[#c82831] px-8 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43]"
        type="button"
        onClick={() => openAuthModal("login")}
      >
        Login
      </button>
    </main>
  );
}
