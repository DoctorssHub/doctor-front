import Image from "next/image";
import { ROULETTE_CHIP_VALUES } from "../../model/roulette-constants";
import { formatCoinAmount } from "../../lib/roulette-formatters";
import { CHIP_IMAGES, formatChipLabel } from "./chip-assets";
import BetCointIcon from "@/assets/BetCointIcon.svg";

type ChipPickerProps = {
  disabled: boolean;
  selectedChip: number;
  totalBetAmount: number;
  onSelectChip: (chip: number) => void;
};

export function ChipPicker({
  disabled,
  selectedChip,
  totalBetAmount,
  onSelectChip,
}: ChipPickerProps) {
  const selectedChipImage = CHIP_IMAGES.get(selectedChip);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Chip Value</span>
        <span className="flex items-center gap-2 font-semibold">
          {selectedChipImage ? (
            <Image
              alt=""
              className="h-5 w-5 object-contain"
              src={selectedChipImage}
            />
          ) : (
            <span className="h-3.5 w-3.5 rounded-full bg-[var(--color-text-subtle)]" />
          )}
          {formatCoinAmount(selectedChip)} COINS
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Bet Amount</span>
        <span className="flex items-center gap-2 font-semibold">
          <Image alt="" className="h-4 w-4 object-contain" src={BetCointIcon} />
          {formatCoinAmount(totalBetAmount)} COINS
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3 pt-2 max-laptop:flex max-laptop:overflow-x-auto tablet:max-laptop:justify-between tablet:max-laptop:overflow-visible">
        {ROULETTE_CHIP_VALUES.map((chip) => {
          const isSelected = chip === selectedChip;
          const chipImage = CHIP_IMAGES.get(chip);

          return (
            <button
              className={[
                "relative grid aspect-square min-h-10 place-items-center rounded-full text-xs font-bold transition max-laptop:h-10 max-laptop:w-10 max-laptop:shrink-0 tablet:max-laptop:h-[58px] tablet:max-laptop:w-[58px]",
                isSelected
                  ? "scale-105 text-[var(--color-text-primary)] drop-shadow-[var(--shadow-roulette-chip-glow)]"
                  : "text-[var(--color-text-muted)] hover:scale-105",
              ].join(" ")}
              disabled={disabled}
              key={chip}
              onClick={() => onSelectChip(chip)}
              type="button"
            >
              {chipImage ? (
                <Image
                  alt={`${formatChipLabel(chip)} coin`}
                  className="h-full w-full object-contain"
                  priority={chip <= 250}
                  src={chipImage}
                />
              ) : (
                <span className="grid h-full w-full place-items-center rounded-full border-4 border-dashed border-[var(--color-accent-purple-soft)] bg-[var(--color-surface-chip)] text-sm text-[var(--color-text-primary)]">
                  {formatChipLabel(chip)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
