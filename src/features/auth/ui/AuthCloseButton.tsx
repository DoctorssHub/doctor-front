import Image from "next/image";
import closeIcon from "@/assets/auth/close-icon.svg";

type AuthCloseButtonProps = {
  onClose: () => void;
};

export function AuthCloseButton({ onClose }: AuthCloseButtonProps) {
  return (
    <button
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-2xl leading-none text-(--color-auth-icon) transition hover:text-(--color-text-primary)"
      type="button"
      aria-label="Close auth dialog"
      onClick={onClose}
    >
      <Image
        src={closeIcon}
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
      />
    </button>
  );
}
