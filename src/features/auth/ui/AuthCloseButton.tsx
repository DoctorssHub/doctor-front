import Image from "next/image";

export function AuthCloseButton() {
  return (
    <button
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-2xl leading-none text-[#b9c0d4] transition hover:text-white"
      type="button"
      aria-label="Close auth dialog"
    >
      <Image
        src="/close-icon.svg"
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
      />
    </button>
  );
}
