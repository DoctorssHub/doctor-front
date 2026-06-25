import axios from "axios";
import { getCurrentUser, refreshSession } from "@/features/auth/api/auth-api";
import type {
  ProfileSettingsResponse,
  ProfileStatsResponse,
} from "./profile-types";

const profileClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export { getCurrentUser };

export async function getProfileStats() {
  return withRefreshRetry(() =>
    profileClient.get<ProfileStatsResponse>("/user/query/me/stats"),
  );
}

export async function getProfileSettings() {
  return withRefreshRetry(() =>
    profileClient.get<ProfileSettingsResponse>("/user/query/settings"),
  );
}

async function withRefreshRetry<T>(request: () => Promise<T>) {
  try {
    return await request();
  } catch (error) {
    if (!isUnauthorizedAxiosError(error)) {
      throw error;
    }

    await refreshSession();

    return request();
  }
}

function isUnauthorizedAxiosError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
