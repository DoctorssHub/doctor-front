import { create } from "zustand";
import type { UserBalance } from "../lib/read-auth-response";

type AuthSessionStore = {
  username: string | null;
  balances: UserBalance[];
  isAuthenticated: boolean;
  setSession: (username: string, balances?: UserBalance[] | null) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionStore>()((set) => ({
  username: null,
  balances: [],
  isAuthenticated: false,
  setSession: (username, balances = []) => {
    set({
      username,
      balances: balances || [],
      isAuthenticated: true,
    });
  },
  clearSession: () => {
    set({
      username: null,
      balances: [],
      isAuthenticated: false,
    });
  },
}));
