type DiceVerifyPreviewProps = {
  roll: number | null;
};

export function DiceVerifyPreview({ roll }: DiceVerifyPreviewProps) {
  const clampedRoll = Math.min(100, Math.max(2, roll ?? 50));
  const markerLeft = `${((clampedRoll - 2) / 98) * 100}%`;

  return (
    <div className="pb-5 pt-8">
      <div className="relative rounded-2xl border-[6px] border-[var(--color-surface-icon)] bg-[var(--color-surface)] px-4 py-6">
        {roll !== null ? (
          <div
            className="absolute -top-12 rounded-md border border-[var(--color-accent-red)]/50 bg-[var(--color-surface-elevated)] px-2 py-1 text-sm font-bold text-[var(--color-text-primary)] shadow-[0_0_18px_rgb(239_68_68/35%)]"
            style={{ left: markerLeft, transform: "translateX(-50%)" }}
          >
            {roll.toFixed(2)}
          </div>
        ) : null}
        <div className="h-3 overflow-hidden rounded-full bg-[var(--color-brand)]">
          <div className="h-full w-1/2 rounded-l-full bg-[var(--color-accent-red)]" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 text-sm font-bold text-[var(--color-text-primary)]">
        {[2, 25, 50, 75, 100].map((tick) => (
          <span
            className={tick === 100 ? "text-right" : tick === 2 ? "" : "text-center"}
            key={tick}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
