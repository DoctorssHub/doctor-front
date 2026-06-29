import Image from "next/image";
import mcqueenLogo from "@/assets/brand/mcqueen-logo.png";

type GlobalLoaderProps = {
  isExiting?: boolean;
};

export function GlobalLoader({ isExiting = false }: GlobalLoaderProps) {
  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-(--color-page) ${
        isExiting ? "global-loader-exit" : ""
      }`}
      role="status"
    >
      <div className="flex flex-col items-center">
        <div className="global-loader-logo-wrap relative">
          <Image
            alt="McQueen 95 logo"
            className="global-loader-logo size-44 object-contain drop-shadow-[0_18px_34px_rgb(200_40_49_/_22%)] max-tablet:size-36"
            height={176}
            priority
            src={mcqueenLogo}
            width={176}
          />
        </div>
        <span
          aria-hidden="true"
          className="global-loader-shadow mt-5 h-5 w-36 rounded-[999px] bg-black/70 blur-lg max-tablet:w-28"
        />
      </div>
    </div>
  );
}
