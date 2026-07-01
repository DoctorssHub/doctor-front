"use client";

import { useState } from "react";
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

export function ProfileTabContent({ user }: ProfileTabContentProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
