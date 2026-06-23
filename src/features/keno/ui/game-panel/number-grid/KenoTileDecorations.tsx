import Image from "next/image";

export function KenoHitPulseBorder() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-[-3px] z-20 animate-[keno-hit-border-pulse_1s_ease-in-out_infinite] rounded-[14px] border-2 border-[#43f785]"
    />
  );
}

export function KenoMissCorners() {
  const cornerClassName =
    "absolute z-20 h-2.5 w-2.5 border-[var(--color-brand-hover)]";

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <span
        className={`${cornerClassName} right-1 top-1 rounded-tr-[3px] border-r-2 border-t-2`}
      />
      <span
        className={`${cornerClassName} bottom-1 left-1 rounded-bl-[3px] border-b-2 border-l-2`}
      />
    </span>
  );
}

export function KenoDiamond() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 z-0 grid place-items-center bg-[radial-gradient(circle,rgb(74_222_128/38%)_0%,rgb(74_222_128/0)_68%)]"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="drop-shadow-[0_0_18px_rgb(74_222_128/85%)] max-[767px]:size-7"
        height={44}
        src="/icon-diamond.svg"
        width={44}
      />
    </span>
  );
}
