"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useAuthSessionStore } from "@/features/auth/model/auth-session-store";
import {
  ProfileCard,
  isUnauthorizedError,
  useProfile,
} from "@/features/profile";
import { ProfileTabContent } from "./ProfileTabContent";

export function ProfileScreen() {
  const router = useRouter();
  const profileQuery = useProfile();
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated);
  const hasBeenAuthenticated = useRef(false);
  const isAuthError =
    profileQuery.isError && isUnauthorizedError(profileQuery.error);

  // Only auth failures bounce the user home; other errors show a retry state.
  useEffect(() => {
    if (isAuthError) {
      router.replace("/");
    }
  }, [isAuthError, router]);

  // Redirect home when the session ends while on the page (e.g. logout).
  useEffect(() => {
    if (isAuthenticated) {
      hasBeenAuthenticated.current = true;
    } else if (hasBeenAuthenticated.current) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-(--color-page) text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col gap-8 px-4 py-10 max-[1023px]:py-8">
        {profileQuery.isSuccess && profileQuery.data ? (
          <div className="profile-page-entrance flex flex-col gap-8">
            <div className="profile-card-entrance">
              <ProfileCard user={profileQuery.data} />
            </div>
            <Suspense fallback={null}>
              <ProfileTabContent user={profileQuery.data} />
            </Suspense>
          </div>
        ) : profileQuery.isError && !isAuthError ? (
          <ProfileErrorState onRetry={() => profileQuery.refetch()} />
        ) : (
          <ProfileLoadingState />
        )}
      </div>
    </main>
  );
}

function ProfileLoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-(--color-text-subtle)">
      Loading profile...
    </div>
  );
}

function ProfileErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-base text-(--color-text-muted)">
        Couldn&apos;t load your profile.
      </p>
      <button
        className="h-11 rounded-lg bg-(--color-brand-strong) px-6 text-sm font-bold text-(--color-brand-contrast) transition hover:bg-(--color-brand-hover)"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
