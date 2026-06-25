import axios from "axios";
import { refreshSession } from "@/features/auth/api/auth-api";

export { getCurrentUser } from "@/features/auth/api/auth-api";

const profileClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export type UpdateUserInfoPayload = {
  username: string;
};

export type UpdateCryptoAddressesPayload = {
  btcAddress: string | null;
  ethAddress: string | null;
  ltcAddress: string | null;
};

export async function updateUserInfo(payload: UpdateUserInfoPayload) {
  return patchWithRefreshRetry("/user/command/update/user-info", payload);
}

// The endpoint replaces the full crypto-address set, so callers must send all
// three addresses (current values plus the edited one) to avoid clearing the
// others.
export async function updateCryptoAddresses(
  payload: UpdateCryptoAddressesPayload,
) {
  return patchWithRefreshRetry("/user/command/update/crypto-addresses", payload);
}

async function patchWithRefreshRetry(url: string, payload: unknown) {
  try {
    return await profileClient.patch(url, payload);
  } catch (error) {
    if (!isUnauthorizedAxiosError(error)) {
      throw error;
    }

    await refreshSession();

    return profileClient.patch(url, payload);
  }
}

function isUnauthorizedAxiosError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
