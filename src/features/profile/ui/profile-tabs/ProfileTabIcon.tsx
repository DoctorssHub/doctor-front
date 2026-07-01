import archiveIcon from "@/assets/profile/archive.svg";
import connectionsIcon from "@/assets/profile/conections.svg";
import userIcon from "@/assets/profile/user.svg";
import type { ProfileTab } from "../../model/profile-tabs";

type ProfileTabIconProps = {
  tab: ProfileTab;
  active: boolean;
};

const ICON_BY_TAB = {
  bets: archiveIcon,
  connections: connectionsIcon,
  profile: userIcon,
} satisfies Record<ProfileTab, typeof userIcon>;

export function ProfileTabIcon({ tab, active }: ProfileTabIconProps) {
  const icon = ICON_BY_TAB[tab];

  return (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 transition-colors"
      style={{
        backgroundColor: active ? "var(--color-highlight)" : "currentColor",
        filter: active
          ? "drop-shadow(0 0 6px rgba(250, 204, 21, 0.55))"
          : undefined,
        maskImage: `url(${icon.src})`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: `url(${icon.src})`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
