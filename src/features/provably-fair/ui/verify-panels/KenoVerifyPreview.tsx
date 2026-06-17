type KenoVerifyPreviewProps = {
  tiles: number[];
};

export function KenoVerifyPreview({ tiles }: KenoVerifyPreviewProps) {
  const selectedTiles = new Set(tiles.map((tile) => tile + 1));

  return (
    <div className="grid grid-cols-8 gap-1.5">
      {Array.from({ length: 40 }, (_, index) => index + 1).map((tile) => {
        const isSelected = selectedTiles.has(tile);

        return (
          <div
            className={[
              "grid aspect-square place-items-center rounded-md border text-sm font-bold",
              isSelected
                ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] shadow-[0_0_14px_rgb(239_68_68/40%)]"
                : "border-[var(--color-border-button)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]",
            ].join(" ")}
            key={tile}
          >
            {tile}
          </div>
        );
      })}
    </div>
  );
}
