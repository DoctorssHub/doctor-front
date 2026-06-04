import { create } from "zustand";
import type { AuthFlow } from "../ui/types";

type AuthModalFlow = Extract<AuthFlow, "login" | "register">;

type AuthModalStore = {
  isOpen: boolean;
  openKey: number;
  initialFlow: AuthModalFlow;
  openAuthModal: (flow?: AuthModalFlow) => void;
  closeAuthModal: () => void;
};

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  openKey: 0,
  initialFlow: "login",
  openAuthModal: (flow = "login") => {
    set((state) => ({
      isOpen: true,
      openKey: state.openKey + 1,
      initialFlow: flow,
    }));
  },
  closeAuthModal: () => {
    set({ isOpen: false });
  },
}));
