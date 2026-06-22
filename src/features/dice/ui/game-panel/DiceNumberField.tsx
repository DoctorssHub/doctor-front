import Image, { type StaticImageData } from "next/image";

type DiceNumberFieldProps = {
  isDisabled?: boolean;
  iconAlt?: string;
  iconSrc?: StaticImageData;
  id: string;
  label: string;
  max?: number;
  min?: number;
  step?: number;
  value: string;
  onIconClick?: () => void;
  onChange: (value: number) => void;
};

export function DiceNumberField({
  isDisabled = false,
  iconAlt = "",
  iconSrc,
  id,
  label,
  max,
  min,
  step = 0.01,
  value,
  onIconClick,
  onChange,
}: DiceNumberFieldProps) {
  function handleChange(value: string) {
    const nextValue = Number(value.replace(",", "."));

    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  }

  const icon = iconSrc ? (
    <Image
      alt={iconAlt}
      aria-hidden={iconAlt ? undefined : true}
      height={20}
      src={iconSrc}
      width={20}
    />
  ) : null;

  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className="mb-2 block text-base font-medium leading-[1.25] text-[#fdfdfd]">
        {label}
      </span>
      <span className="flex h-11 w-[170px] items-center rounded-lg border border-[#1b1f26] bg-[rgba(43,48,59,0.5)] p-3 max-[767px]:w-full max-mobile:h-9 max-mobile:px-2 mobile:max-tablet:h-9 mobile:max-tablet:px-2">
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-normal text-white/75 outline-none"
          disabled={isDisabled}
          id={id}
          inputMode="decimal"
          max={max}
          min={min}
          onChange={(event) => handleChange(event.target.value)}
          step={step}
          type="text"
          value={value}
        />
        {icon ? (
          onIconClick ? (
            <button
              aria-label={iconAlt}
              className="ml-2 grid size-5 shrink-0 place-items-center"
              disabled={isDisabled}
              onClick={onIconClick}
              type="button"
            >
              {icon}
            </button>
          ) : (
            <span className="ml-2 grid size-5 shrink-0 place-items-center">
              {icon}
            </span>
          )
        ) : null}
      </span>
    </label>
  );
}
