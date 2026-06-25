"use client";

import { useState } from "react";
import { useAuthModalStore } from "@/features/auth";
import {
  ProfileCard,
  ProfilePreferences,
  ProfileSectionHeading,
  ProfileStatistics,
  ProfileTabs,
  ProfileUsernameField,
  ProfileWallets,
  useProfile,
  useProfileSettings,
  useProfileStats,
  type ProfileTab,
} from "@/features/profile";
import { BetHistoryTable } from "@/widgets/bet-history";

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const openAuthModal = useAuthModalStore((state) => state.openAuthModal);

  const profileQuery = useProfile();
  const isAuthenticated = profileQuery.isSuccess;
  const statsQuery = useProfileStats({ enabled: isAuthenticated });
  const settingsQuery = useProfileSettings({ enabled: isAuthenticated });

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-(--color-page) text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col gap-8 px-4 py-10 max-[1023px]:py-8">
        {profileQuery.isLoading ? (
          <ProfileLoadingState />
        ) : profileQuery.isError || !profileQuery.data ? (
          <ProfileGuard onLogin={() => openAuthModal("login")} />
        ) : (
          <>
            <ProfileCard user={profileQuery.data} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "profile" ? (
              <div className="flex flex-col gap-8">
                <section className="flex flex-col gap-6">
                  <ProfileSectionHeading size="lg" title="Profile" />
                  <ProfileUsernameField username={profileQuery.data.username} />
                </section>

                <section className="flex flex-col gap-4">
                  <ProfileSectionHeading title="Statistics" />
                  <ProfileStatistics
                    isLoading={statsQuery.isLoading}
                    stats={statsQuery.data}
                  />
                </section>

                <section className="flex flex-col gap-4">
                  <ProfileSectionHeading title="Preferences" />
                  <ProfilePreferences
                    initialPrivateMode={settingsQuery.data?.privateMode}
                  />
                </section>

                <section className="flex flex-col gap-4">
                  <ProfileSectionHeading title="Crypto wallets" />
                  <ProfileWallets
                    addresses={profileQuery.data.userCryptoAddresses}
                  />
                </section>
              </div>
            ) : (
              <BetHistoryTable variant="profile" />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ProfileLoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-(--color-text-subtle)">
      Loading profile…
    </div>
  );
}

function ProfileGuard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-base text-(--color-text-muted)">
        Log in to view your profile
      </p>
      <button
        className="h-11 rounded-lg bg-(--color-brand-strong) px-6 text-sm font-bold text-(--color-brand-contrast) transition hover:bg-(--color-brand-hover)"
        onClick={onLogin}
        type="button"
      >
        Log In
      </button>
    </div>
  );
}
