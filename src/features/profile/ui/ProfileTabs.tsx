"use client";

import archiveIcon from "@/assets/profile/archive.svg";
import userIcon from "@/assets/profile/user.svg";
import { ModeTabs } from "@/shared/ui/mode-tabs";
import { PROFILE_TABS, type ProfileTab } from "../model/profile-tabs";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <ModeTabs
      activeButtonClassName="bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-(--color-text-primary)"
      buttonClassName="flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition"
      className="grid h-[60px] grid-cols-2 gap-2 rounded-xl bg-(--color-surface) p-1.5 max-mobile:gap-1"
      inactiveButtonClassName="text-(--color-text-subtle) hover:text-(--color-text-primary)"
      mode={activeTab}
      onModeChange={onTabChange}
      options={PROFILE_TABS}
      renderIcon={(tab, active) => <TabIcon active={active} tab={tab} />}
    />
  );
}

function TabIcon({ tab, active }: { tab: ProfileTab; active: boolean }) {
  const icon = tab === "profile" ? userIcon : archiveIcon;

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
