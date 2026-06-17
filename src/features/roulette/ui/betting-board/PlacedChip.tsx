import Image from "next/image";
import {
  CHIP_DENOMINATIONS,
  CHIP_IMAGES,
  DEFAULT_CHIP_IMAGE,
  formatChipLabel,
} from "../bet-controls/chip-assets";

type PlacedChipProps = {
  amount: number;
};

function getDisplayChipAmount(amount: number) {
  return (
    CHIP_DENOMINATIONS.findLast((denomination) => denomination <= amount) ?? 1
  );
}

function getStackChipAmount(amount: number) {
  return (
    CHIP_DENOMINATIONS.findLast((denomination) => {
      const nextDenomination = CHIP_DENOMINATIONS.find(
        (candidate) => candidate > denomination,
      );

      return amount >= denomination && amount < (nextDenomination ?? Infinity);
    }) ?? 1
  );
}

export function PlacedChip({ amount }: PlacedChipProps) {
  const displayAmount = getDisplayChipAmount(amount);
  const stackChipAmount = getStackChipAmount(amount);
  const stackCount =
    amount === displayAmount
      ? 1
      : Math.min(4, Math.max(1, Math.floor(amount / stackChipAmount)));
  const image = CHIP_IMAGES.get(displayAmount) ?? DEFAULT_CHIP_IMAGE;
  const stackImage = CHIP_IMAGES.get(stackChipAmount) ?? DEFAULT_CHIP_IMAGE;
  const shouldShowAmount = amount !== displayAmount || stackCount > 1;
  const topOffset = (stackCount - 1) * 3;

  return (
    <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <span className="relative h-[34px] w-[34px]">
        {Array.from({ length: stackCount }).map((_, index) => {
          const isTopChip = index === stackCount - 1;
          const offset = index * 3;

          return (
            <Image
              alt=""
              className="absolute left-0 top-0 h-[34px] w-[34px] object-contain drop-shadow-[var(--shadow-roulette-chip)]"
              draggable={false}
              key={`${amount}-${index}`}
              src={isTopChip ? image : stackImage}
              style={{
                transform: `translateY(-${offset}px)`,
                zIndex: isTopChip ? stackCount + 1 : index + 1,
              }}
            />
          );
        })}
        {shouldShowAmount ? (
          <span
            className="absolute left-[9px] top-[9px] z-20 grid h-[16px] w-[16px] place-items-center rounded-full bg-[var(--color-surface-icon)] text-[12px] font-semibold leading-none text-[var(--color-text-primary)]"
            style={{ transform: `translateY(-${topOffset}px)` }}
          >
            {formatChipLabel(amount)}
          </span>
        ) : null}
      </span>
    </span>
  );
}
