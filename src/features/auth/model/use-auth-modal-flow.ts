import { useState } from "react";
import { useAuthSessionStore } from "./auth-session-store";
import type { UserBalance } from "../lib/read-auth-response";
import type { AuthFlow } from "../ui/types";

type InitialAuthFlow = Extract<AuthFlow, "login" | "register">;

type RegisteredPayload = {
  verificationToken: string;
  email: string;
  username: string;
};

export function useAuthModalFlow(
  initialFlow: InitialAuthFlow,
  onClose: () => void,
) {
  const [flow, setFlow] = useState<AuthFlow>(initialFlow);
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationUsername, setVerificationUsername] = useState("");
  const setSession = useAuthSessionStore((state) => state.setSession);

  function handleRegistered({
    verificationToken,
    email,
    username,
  }: RegisteredPayload) {
    setVerificationToken(verificationToken);
    setVerificationEmail(email);
    setVerificationUsername(username);
    setFlow("verify-email");
  }

  function handleLoggedIn(username: string, balances?: UserBalance[] | null) {
    setSession(username, balances);
    onClose();
  }

  function handleVerified(username: string, balances?: UserBalance[] | null) {
    setSession(username, balances);
    onClose();
  }

  function handleVerifyBack() {
    setVerificationToken("");
    setVerificationEmail("");
    setVerificationUsername("");
    setFlow("login");
  }

  return {
    flow,
    setFlow,
    verificationToken,
    verificationEmail,
    verificationUsername,
    handleRegistered,
    handleLoggedIn,
    handleVerified,
    handleVerifyBack,
  };
}
