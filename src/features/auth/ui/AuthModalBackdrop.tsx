"use client";

import { type MouseEvent, type ReactNode, useEffect } from "react";

type AuthModalBackdropProps = {
  children: ReactNode;
  onClose: () => void;
};

export function AuthModalBackdrop({
  children,
  onClose,
}: AuthModalBackdropProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-(--color-auth-backdrop)/80 p-4 text-(--color-text-primary) backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
}
