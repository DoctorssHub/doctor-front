"use client";

import { ModeTabs } from "@/shared/ui/mode-tabs";
import { PROFILE_TABS, type ProfileTab } from "../model/profile-tabs";
import { ProfileTabIcon } from "./profile-tabs/ProfileTabIcon";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <ModeTabs
      activeButtonClassName="bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] text-(--color-text-primary)"
      buttonClassName="flex h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition max-mobile:gap-1 max-mobile:text-xs"
      className="grid h-[60px] grid-cols-3 gap-2 rounded-xl bg-(--color-surface) p-1.5 max-mobile:gap-1"
      inactiveButtonClassName="text-(--color-text-subtle) hover:text-(--color-text-primary)"
      mode={activeTab}
      onModeChange={onTabChange}
      options={PROFILE_TABS}
      renderIcon={(tab, active) => (
        <ProfileTabIcon active={active} tab={tab} />
      )}
    />
  );
}
