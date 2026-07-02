"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

function getProfileTabFromParam(tabParam: string | null): ProfileTab {
  const match = Object.entries(profileTabParams).find(
    ([, param]) => param === tabParam,
  );

  return match ? (match[0] as ProfileTab) : "profile";
}

function getProfileTabUrl({
  pathname,
  searchParams,
  tab,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  tab: ProfileTab;
}) {
  const tabParam = profileTabParams[tab];

  if (tabParam) {
    searchParams.set("tab", tabParam);
  } else {
    searchParams.delete("tab");
  }

  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function ProfileTabContent({ user }: ProfileTabContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getProfileTabFromParam(searchParams.get("tab"));

  function handleTabChange(tab: ProfileTab) {
    router.push(
      getProfileTabUrl({
        pathname,
        searchParams: new URLSearchParams(searchParams.toString()),
        tab,
      }),
      { scroll: false },
    );
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
