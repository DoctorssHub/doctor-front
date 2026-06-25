import Image from "next/image";
import { headerProfileItems } from "./profile-items";

type HeaderProfileDropdownProps = {
  isLogoutPending: boolean;
  onLogout: () => void;
};

export function HeaderProfileDropdown({
  isLogoutPending,
  onLogout,
}: HeaderProfileDropdownProps) {
  return (
    <div className="fixed top-16 right-0 z-50 w-[260px] max-mobile:w-[min(260px,calc(100vw-16px))]">
      <div className="origin-top-right rounded-bl-[14px] bg-[#0a0d19] px-4 pt-5 pb-4 shadow-[0_16px_32px_rgb(0_0_0/35%)] ring-1 ring-[#121826] [animation:dice-mode-panel-in_180ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="flex flex-col gap-2">
          {headerProfileItems.map((item) => (
            <button
              className="relative flex h-9 cursor-pointer items-center gap-2 overflow-hidden rounded-[6px] p-2 text-center text-[16px] leading-[125%] font-normal text-[#c7cbd4] transition before:absolute before:inset-0 before:bg-[linear-gradient(90deg,var(--color-brand)_0%,#70171d_100%)] before:opacity-0 before:transition-opacity before:content-[''] hover:text-[#fdfdfd] hover:before:opacity-70 focus-visible:text-[#fdfdfd] focus-visible:outline-none focus-visible:before:opacity-70"
              key={item.label}
              type="button"
            >
              <ProfileItemIcon item={item} />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="my-4 h-px bg-[#3f4a59]/50" />

        <button
          className="relative flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[6px] border border-transparent bg-[#252b36] text-[16px] leading-[125%] font-bold text-[#fdfdfd] transition-[border-color,box-shadow,background-color,transform] before:absolute before:inset-0 before:bg-[var(--color-brand)] before:opacity-0 before:blur-xl before:transition before:content-[''] hover:border-[var(--color-brand)] hover:bg-[#252b36] hover:shadow-[0_0_18px_rgb(200_40_49/45%)] hover:before:opacity-45 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:shadow-[0_0_18px_rgb(200_40_49/45%)]"
          disabled={isLogoutPending}
          type="button"
          onClick={onLogout}
        >
          <LogoutIcon />
          <span className="relative">
            {isLogoutPending ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}

function ProfileItemIcon({ item }: { item: (typeof headerProfileItems)[number] }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="relative z-10 size-5 shrink-0 object-contain opacity-80"
      height={20}
      src={item.icon}
      width={20}
    />
  );
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="relative size-5 shrink-0"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.125 3.125H5.625C4.58947 3.125 3.75 3.96447 3.75 5V15C3.75 16.0355 4.58947 16.875 5.625 16.875H8.125M12.5 6.25L16.25 10M16.25 10L12.5 13.75M16.25 10H7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
