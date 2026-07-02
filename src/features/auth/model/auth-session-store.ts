import { create } from "zustand";
import type { UserBalance } from "../lib/read-auth-response";

type AuthSessionStore = {
  username: string | null;
  profileImgUrl: string | null;
  balances: UserBalance[];
  isAuthenticated: boolean;
  setSession: (
    username: string,
    balances?: UserBalance[] | null,
    profileImgUrl?: string | null,
  ) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionStore>()((set) => ({
  username: null,
  profileImgUrl: null,
  balances: [],
  isAuthenticated: false,
  setSession: (username, balances = [], profileImgUrl = null) => {
    set({
      username,
      profileImgUrl,
      balances: balances || [],
      isAuthenticated: true,
    });
  },
  clearSession: () => {
    set({
      username: null,
      profileImgUrl: null,
      balances: [],
      isAuthenticated: false,
    });
  },
}));
