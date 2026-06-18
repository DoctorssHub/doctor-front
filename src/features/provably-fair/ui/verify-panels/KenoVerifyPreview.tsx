type KenoVerifyPreviewProps = {
  tiles: number[];
};

export function KenoVerifyPreview({ tiles }: KenoVerifyPreviewProps) {
  const selectedTiles = new Set(tiles.map((tile) => tile + 1));

  return (
    <div className="mx-auto grid w-[576px] grid-cols-8 gap-1">
      {Array.from({ length: 40 }, (_, index) => index + 1).map((tile) => {
        const isSelected = selectedTiles.has(tile);

        return (
          <div
            className={[
              "grid size-[67px] place-items-center rounded-[12px] border border-[rgba(63,74,89,0.5)] bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] px-3 py-[18px] text-center text-xl font-semibold text-[#fdfdfd]",
              isSelected
                ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)] shadow-[0_0_14px_rgb(239_68_68/40%)]"
                : "",
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
