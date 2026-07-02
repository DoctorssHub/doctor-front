"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFairnessSeed,
  updateFairnessSeed,
} from "../api/provably-fair-api";
import { SeedField } from "./SeedField";

export function SeedsTab() {

  const queryClient = useQueryClient();
  const [clientSeed, setClientSeed] = useState<string | null>(null);

  const seedQuery = useQuery({
    queryKey: ["fairness", "seed"],
    queryFn: async () => {
      const response = await getFairnessSeed();

      return response.data;
    },
  });

  const seedMutation = useMutation({
    mutationFn: updateFairnessSeed,
    onSuccess: (response) => {
      setClientSeed(response.data.clientSeed);
      queryClient.setQueryData(["fairness", "seed"], response.data);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextClientSeed = (clientSeed ?? seedQuery.data?.clientSeed ?? "").trim();

    if (!nextClientSeed || seedMutation.isPending) {
      return;
    }

    seedMutation.mutate({ clientSeed: nextClientSeed });
  }

  if (seedQuery.isLoading) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
        Loading seed data...
      </div>
    );
  }

  if (seedQuery.isError || !seedQuery.data) {
    return (
      <div className="rounded-lg border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red)]/10 p-4 text-sm text-[var(--color-text-primary)]">
        Seed data is unavailable. Check auth and backend `/fairness/seed`.
      </div>
    );
  }

  const seed = seedQuery.data;
  const editableClientSeed = clientSeed ?? seed.clientSeed;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <SeedField label="Active client seed" value={seed.clientSeed} />
        <SeedField
          label="Active server seed hash"
          value={seed.hashedServerSeed}
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          Rotate Seed Pair
        </h3>
        <SeedField label="Total Bets Made with Pair" value={seed.nonce} />

        <label className="block text-sm font-light text-[#c7cbd4]">
          New client seed
          <span className="mt-2 flex gap-3">
            <input
              className="h-11 min-w-0 flex-1 rounded-[8px] border border-[#1b1f26] bg-[#0e121c] px-3 py-3 text-sm font-normal text-[#c7cbd4] outline-none transition placeholder:text-[#c7cbd4]/45 focus:border-[var(--color-brand)]"
              maxLength={128}
              onChange={(event) => {
                setClientSeed(event.target.value);
              }}
              placeholder="Enter new client seed"
              value={editableClientSeed}
            />
            <button
              className="h-12 w-[88px] shrink-0 rounded-[8px] border border-[#1b1f26] bg-[linear-gradient(180deg,#1b1f26_0%,#2b303b_100%)] px-4 py-3.5 text-sm font-bold text-[var(--color-text-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={seedMutation.isPending || !editableClientSeed.trim()}
              type="submit"
            >
              {seedMutation.isPending ? "Changing" : "Change"}
            </button>
          </span>
        </label>

        <SeedField
          label="Next Server Seed (Hash)"
          value={seed.nextHashedServerSeed}
        />

        {seedMutation.isError ? (
          <p className="text-sm text-[var(--color-accent-red)]">
            Could not change seed. Try again before placing a bet.
          </p>
        ) : null}
      </section>
    </form>
  );
}
