"use client";

import { useState } from "react";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  getProfileConnections,
  startProfileConnection,
  type ProfileConnection,
  type ProfileConnectionProvider,
} from "../../model/profile-connections";
import { ConnectionCard } from "./ConnectionCard";

type ProfileConnectionsProps = {
  user: MeResponse;
};

export function ProfileConnections({ user }: ProfileConnectionsProps) {
  const [pendingProvider, setPendingProvider] =
    useState<ProfileConnectionProvider | null>(null);
  const connections = getProfileConnections(user);

  function handleConnect(connection: ProfileConnection) {
    setPendingProvider(connection.provider);
    startProfileConnection(connection.startPath);
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-(--color-text-primary) max-mobile:text-xl">
        Connections
      </h2>

      <div className="grid grid-cols-2 gap-3 max-mobile:grid-cols-1">
        {connections.map((connection) => (
          <ConnectionCard
            connection={connection}
            isPending={pendingProvider === connection.provider}
            key={connection.provider}
            onConnect={handleConnect}
          />
        ))}
      </div>
    </section>
  );
}
