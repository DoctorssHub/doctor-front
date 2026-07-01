import type { MeResponse } from "@/features/auth/api/auth-types";

export type ProfileConnectionProvider = "discord" | "google" | "kick" | "steam";

export type ProfileConnection = {
  description: string;
  isConnected: boolean;
  label: string;
  provider: ProfileConnectionProvider;
  startPath: string;
};

export function getProfileConnections(user: MeResponse): ProfileConnection[] {
  return [
    {
      description: "Connect Discord to unlock community features",
      isConnected: Boolean(user.hasVerifiedRoleOnDiscordGuild),
      label: "Discord",
      provider: "discord",
      startPath: "/auth/discord/verify",
    },
    {
      description: "Connect Kick to unlock community features",
      isConnected: hasAuthProvider(user.userAuthProvider, "kick"),
      label: "Kick",
      provider: "kick",
      startPath: "/auth/kick/connect",
    },
    {
      description: "Connect Google to unlock account sign-in options",
      isConnected: hasAuthProvider(user.userAuthProvider, "google"),
      label: "Google",
      provider: "google",
      startPath: "/auth/google/connect",
    },
    {
      description: "Connect Steam to unlock account sign-in options",
      isConnected: hasAuthProvider(user.userAuthProvider, "steam"),
      label: "Steam",
      provider: "steam",
      startPath: "/auth/steam/connect",
    },
  ];
}

export function startProfileConnection(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(`/api${path}`);
}

function hasAuthProvider(providers: unknown[], provider: ProfileConnectionProvider) {
  return providers.some((value) => valueContainsProvider(value, provider));
}

function valueContainsProvider(
  value: unknown,
  provider: ProfileConnectionProvider,
): boolean {
  if (!value) {
    return false;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === provider;
  }

  if (Array.isArray(value)) {
    return value.some((item) => valueContainsProvider(item, provider));
  }

  if (typeof value !== "object") {
    return false;
  }

  return Object.entries(value as Record<string, unknown>).some(
    ([key, entryValue]) =>
      isProviderKey(key) && valueContainsProvider(entryValue, provider),
  );
}

function isProviderKey(key: string) {
  return /provider|strategy|type|name/i.test(key);
}
