import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthSessionStore = {
  username: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (username: string, accessToken: string | null) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionStore>()(
  persist(
    (set) => ({
      username: null,
      accessToken: null,
      isAuthenticated: false,
      setSession: (username, accessToken) => {
        set({
          username,
          accessToken,
          isAuthenticated: true,
        });
      },
      clearSession: () => {
        set({
          username: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "doctor-auth-session",
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const state = persistedState as Partial<AuthSessionStore>;

        if (typeof state.username === "string" && state.username.includes("@")) {
          return {
            ...state,
            username: null,
            accessToken: null,
            isAuthenticated: false,
          };
        }

        return persistedState;
      },
      version: 2,
    },
  ),
);
