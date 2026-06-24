import { memo, type MouseEvent } from "react";
import {
  KENO_TILE_SCALE_ANIMATION_OPTIONS,
  KENO_TILE_SCALE_KEYFRAMES,
} from "./keno-tile-animation";
import {
  KenoDiamond,
  KenoHitPulseBorder,
  KenoMissCorners,
} from "./KenoTileDecorations";

export type KenoTileState = "default" | "selected" | "result" | "hit" | "miss";

const baseTileClassName =
  "relative grid size-[67px] place-items-center overflow-hidden rounded-xl border text-xl max-[767px]:size-[38px] max-[767px]:rounded-lg max-[767px]:text-xs font-semibold transition-[transform,border-color,background-color,box-shadow,color] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-highlight)] disabled:cursor-wait disabled:hover:scale-100 disabled:active:scale-100";

const tileStateClassName: Record<KenoTileState, string> = {
  default:
    "border-[#303846] bg-[linear-gradient(145deg,#202630_0%,#252c37_100%)] text-white hover:scale-[1.035] hover:border-[var(--color-highlight)] hover:shadow-[0_0_18px_rgb(250_204_21/22%)]",
  hit: "overflow-visible border-[#43f785] bg-transparent text-black shadow-[0_0_24px_rgb(34_197_94/48%)]",
  miss: "border-[var(--color-brand-hover)] bg-transparent text-[var(--color-brand-hover)] shadow-[0_0_18px_rgb(239_68_68/28%)] hover:border-[var(--color-highlight)]",
  result:
    "border-[#3dea7d] bg-[linear-gradient(145deg,#42e781_0%,#1fb65e_100%)] text-[#061b10] shadow-[0_0_20px_rgb(34_197_94/32%)]",
  selected:
    "border-[var(--color-brand-hover)] bg-[linear-gradient(145deg,var(--color-brand-hover)_0%,var(--color-brand)_48%,#8f1720_100%)] text-[var(--color-brand-contrast)] shadow-[var(--shadow-brand-glow)] hover:border-[var(--color-highlight)] hover:shadow-[0_0_18px_rgb(250_204_21/22%)]",
};

type KenoTileProps = {
  disabled: boolean;
  number: number;
  onSelect: (number: number) => void;
  setTileRef: (number: number, element: HTMLButtonElement | null) => void;
  state: KenoTileState;
};

export const KenoTile = memo(function KenoTile({
  disabled,
  number,
  onSelect,
  setTileRef,
  state,
}: KenoTileProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    animateTileSelection(event.currentTarget);
    onSelect(number);
  }

  return (
    <button
      aria-label={`${state === "selected" ? "Deselect" : "Select"} number ${number}`}
      aria-pressed={state === "selected"}
      className={getTileClassName(state)}
      disabled={disabled}
      onClick={handleClick}
      ref={(element) => setTileRef(number, element)}
      type="button"
    >
      <KenoTileContent
        number={number}
        state={state}
      />
    </button>
  );
});

function animateTileSelection(element: HTMLButtonElement) {
  element.animate(
    KENO_TILE_SCALE_KEYFRAMES,
    KENO_TILE_SCALE_ANIMATION_OPTIONS,
  );
}

function getTileClassName(state: KenoTileState) {
  return [baseTileClassName, tileStateClassName[state]].join(" ");
}

function KenoTileContent({
  number,
  state,
}: {
  number: number;
  state: KenoTileState;
}) {
  return (
    <>
      {state === "hit" ? <KenoDiamond /> : null}
      {state === "hit" ? <KenoHitPulseBorder /> : null}
      {state === "miss" ? <KenoMissCorners /> : null}
      <span className="relative z-10">{number}</span>
    </>
  );
}
