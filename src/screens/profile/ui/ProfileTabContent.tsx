"use client";

import { useEffect, useState } from "react";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  ProfilePreferences,
  ProfileConnections,
  ProfileSectionHeading,
  ProfileStatistics,
  ProfileTabs,
  ProfileUsernameField,
  ProfileWallets,
  type ProfileTab,
} from "@/features/profile";
import { BetHistoryTable } from "@/widgets/bet-history";

type ProfileTabContentProps = {
  user: MeResponse;
};

const profileTabParams: Record<ProfileTab, string | null> = {
  profile: null,
  bets: "bets-history",
  connections: "connections",
};

function getProfileTabFromSearch(search: string): ProfileTab {
  const tabParam = new URLSearchParams(search).get("tab");
  const match = Object.entries(profileTabParams).find(
    ([, param]) => param === tabParam,
  );

  return match ? (match[0] as ProfileTab) : "profile";
}

function getProfileTabUrl(tab: ProfileTab) {
  const params = new URLSearchParams(window.location.search);
  const tabParam = profileTabParams[tab];

  if (tabParam) {
    params.set("tab", tabParam);
  } else {
    params.delete("tab");
  }

  const query = params.toString();

  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
}

export function ProfileTabContent({ user }: ProfileTabContentProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  useEffect(() => {
    function syncTabWithSearch() {
      setActiveTab(getProfileTabFromSearch(window.location.search));
    }

    syncTabWithSearch();
    window.addEventListener("popstate", syncTabWithSearch);

    return () => {
      window.removeEventListener("popstate", syncTabWithSearch);
    };
  }, []);

  function handleTabChange(tab: ProfileTab) {
    setActiveTab(tab);
    window.history.pushState(null, "", getProfileTabUrl(tab));
  }

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "profile" ? (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <ProfileSectionHeading size="lg" title="Profile" />
            <ProfileUsernameField username={user.username} />
          </section>

          <section className="flex flex-col gap-4">
            <ProfileSectionHeading title="Statistics" />
            <ProfileStatistics />
          </section>

          <section className="flex flex-col gap-4">
            <ProfileSectionHeading title="Preferences" />
            <ProfilePreferences />
          </section>

          <section className="flex flex-col gap-4">
            <ProfileSectionHeading title="Crypto wallets" />
            <ProfileWallets addresses={user.userCryptoAddresses} />
          </section>
        </div>
      ) : activeTab === "connections" ? (
        <ProfileConnections user={user} />
      ) : (
        <BetHistoryTable variant="profile" />
      )}
    </>
  );
}
