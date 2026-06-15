"use client";

import { memo, type ReactNode } from "react";

type GameSidebarProps = {
  children?: ReactNode;
};

export const GameSidebar = memo(function GameSidebar({
  children,
}: GameSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#0E121C] px-5 py-6 min-[1024px]:w-[330px] min-[1024px]:px-7 max-[1023px]:order-2 max-[1023px]:border-t max-[1023px]:border-[#111827] max-[767px]:px-4 max-[767px]:py-5">
      {children}
    </aside>
  );
});
