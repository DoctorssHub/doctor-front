import { create } from "zustand";

type AuthSessionStore = {
  username: string | null;
  isAuthenticated: boolean;
  setSession: (username: string) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionStore>()((set) => ({
  username: null,
  isAuthenticated: false,
  setSession: (username) => {
    set({
      username,
      isAuthenticated: true,
    });
  },
  clearSession: () => {
    set({
      username: null,
      isAuthenticated: false,
    });
  },
}));
