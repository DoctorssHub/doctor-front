import Image from "next/image";
import lockIcon from "@/assets/profile/lock.svg";

type ProfileUsernameFieldProps = {
  username: string;
};

export function ProfileUsernameField({ username }: ProfileUsernameFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[14px] text-(--color-text-muted) font-light"
        htmlFor="profile-username"
      >
        Username
      </label>
      <div className="relative max-w-sm max-tablet:max-w-none">
        <input
          aria-readonly="true"
          className="h-11 w-full cursor-not-allowed rounded-lg border border-(--color-border-strong) bg-(--color-roulette-win-number-dark)/50 px-3.5 pr-10 text-sm text-(--color-text-disabled)"
          disabled
          id="profile-username"
          readOnly
          type="text"
          value={username}
        />
        <Image
          alt="Locked field"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2"
          src={lockIcon}
        />
      </div>
      <p className="text-xs text-(--color-text-disabled)">
        Used to login to site, can&apos;t be changed
      </p>
    </div>
  );
}
