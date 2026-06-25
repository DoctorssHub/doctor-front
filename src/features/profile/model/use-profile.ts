"use client";

import { useQuery } from "@tanstack/react-query";
import type { MeResponse } from "@/features/auth/api/auth-types";
import { getCurrentUser } from "../api/profile-api";

export function useProfile() {
  return useQuery<MeResponse>({
    queryKey: ["profile", "me"],
    retry: false,
    queryFn: async () => {
      const response = await getCurrentUser();

      return response.data;
    },
  });
}
