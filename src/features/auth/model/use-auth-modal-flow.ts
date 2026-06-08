import { useState } from "react";
import { useAuthSessionStore } from "./auth-session-store";
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

  function handleLoggedIn(username: string) {
    setSession(username);
    onClose();
  }

  function handleVerified(username: string) {
    setSession(username);
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
