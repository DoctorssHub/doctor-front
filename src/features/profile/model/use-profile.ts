"use client";

import { useQuery } from "@tanstack/react-query";
import type { MeResponse } from "@/features/auth/api/auth-types";
import {
  getCurrentUser,
  getProfileSettings,
  getProfileStats,
} from "../api/profile-api";
import { parseProfileSettings, parseProfileStats } from "../lib/profile-parsers";

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

export function useProfileStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["profile", "stats"],
    enabled: options?.enabled ?? true,
    retry: false,
    queryFn: async () => {
      const response = await getProfileStats();

      return parseProfileStats(response.data);
    },
  });
}

export function useProfileSettings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["profile", "settings"],
    enabled: options?.enabled ?? true,
    retry: false,
    queryFn: async () => {
      const response = await getProfileSettings();

      return parseProfileSettings(response.data);
    },
  });
}
