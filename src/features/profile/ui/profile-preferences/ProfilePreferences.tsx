"use client";

import { useState } from "react";

type ProfilePreferencesProps = {
  initialPrivateMode?: boolean;
};

// UI-only for now: the toggle holds local state. Persisting to
// `/user/query/settings` is wired once the backend contract is confirmed.
export function ProfilePreferences({
  initialPrivateMode = false,
}: ProfilePreferencesProps) {
  const [privateMode, setPrivateMode] = useState(initialPrivateMode);
  const [seededValue, setSeededValue] = useState(initialPrivateMode);

  // Re-seed from async settings without an effect (render-phase sync).
  if (seededValue !== initialPrivateMode) {
    setSeededValue(initialPrivateMode);
    setPrivateMode(initialPrivateMode);
  }

  return (
    <div className="flex items-center gap-4 rounded-xl bg-(--color-surface) px-4 py-3">
      <button
        aria-checked={privateMode}
        aria-label="Private Mode"
        className={`relative h-5 w-8 shrink-0 rounded-full transition ${
          privateMode
            ? "bg-(--color-roulette-history-green)"
            : "bg-(--color-border-button)"
        }`}
        onClick={() => setPrivateMode((value) => !value)}
        role="switch"
        type="button"
      >
        <span
          className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
            privateMode ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </button>
      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-medium text-(--color-text-primary)">
          Private Mode
        </p>
        <p className="text-[14px] text-(--color-text-muted)">
          Other users won&apos;t be able to view your wins, losses and wagered
          statistics
        </p>
      </div>
    </div>
  );
}
