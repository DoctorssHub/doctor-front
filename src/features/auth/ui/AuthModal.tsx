"use client";

import { ReactNode } from "react";
import { AuthCloseButton } from "./AuthCloseButton";
import { AuthSocialActions } from "./AuthSocialActions";
import { AuthTabs } from "./AuthTabs";
import { AuthVisualPanel } from "./AuthVisualPanel";
import { RegisterForm } from "./RegisterForm";
import { VerifyEmailForm } from "./VerifyEmailForm";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { useAuthModalStore } from "../model/auth-modal-store";
import { useAuthModalFlow } from "../model/use-auth-modal-flow";
import type { AuthFlow } from "./types";

export function AuthModal() {
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const openKey = useAuthModalStore((state) => state.openKey);
  const initialFlow = useAuthModalStore((state) => state.initialFlow);
  const closeAuthModal = useAuthModalStore((state) => state.closeAuthModal);

  if (!isOpen) {
    return null;
  }

  return (
    <AuthModalContent
      key={openKey}
      initialFlow={initialFlow}
      onClose={closeAuthModal}
    />
  );
}

type AuthModalContentProps = {
  initialFlow: Extract<AuthFlow, "login" | "register">;
  onClose: () => void;
};

function AuthModalContent({ initialFlow, onClose }: AuthModalContentProps) {
  const {
    flow,
    setFlow,
    verificationToken,
    verificationEmail,
    verificationUsername,
    handleRegistered,
    handleLoggedIn,
    handleVerified,
    handleVerifyBack,
  } = useAuthModalFlow(initialFlow, onClose);

  let authFlowContent: ReactNode = null;

  switch (flow) {
    case "register":
      authFlowContent = <RegisterForm onRegistered={handleRegistered} />;
      break;
    case "login":
      authFlowContent = (
        <LoginForm
          onLoggedIn={handleLoggedIn}
          onForgotPasswordClick={() => setFlow("forgot-password")}
        />
      );
      break;
    case "forgot-password":
      authFlowContent = (
        <ForgotPasswordForm
          onSubmitted={() => setFlow("reset-password")}
          onBack={() => setFlow("login")}
        />
      );
      break;
    case "reset-password":
      authFlowContent = (
        <ResetPasswordForm
          onReset={() => setFlow("login")}
          onBack={() => setFlow("login")}
        />
      );
      break;
  }

  if (flow === "verify-email") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-(--color-auth-backdrop)/80 p-4 text-(--color-text-primary) backdrop-blur-sm">
        <section
          className="relative w-full max-w-140 overflow-hidden rounded-3xl bg-(--color-page-raised) p-4 shadow-(--shadow-auth-modal) sm:px-8 sm:py-9"
          role="dialog"
          aria-modal="true"
          aria-label="Verify email"
        >
          <AuthCloseButton onClose={onClose} />
          <VerifyEmailForm
            verificationToken={verificationToken}
            email={verificationEmail}
            fallbackUsername={verificationUsername}
            onVerified={handleVerified}
            onBack={handleVerifyBack}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-(--color-auth-backdrop)/80 p-4 text-(--color-text-primary) backdrop-blur-sm">
      <section
        className="flex h-240.25 max-h-screen w-full max-w-3xl overflow-hidden rounded-4xl lg:h-187.25 lg:max-w-250"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        <AuthVisualPanel />

        <div className="relative flex h-full w-full items-start justify-center overflow-hidden bg-(--color-page-raised) px-8 py-10 sm:px-10 lg:w-125">
          <AuthCloseButton onClose={onClose} />

          <section className="flex h-full w-full max-w-none flex-col lg:max-w-105">
            <AuthTabs flow={flow} onChange={setFlow} />

            <div className="min-h-0 flex-1">{authFlowContent}</div>

            <AuthSocialActions flow={flow} />
          </section>
        </div>
      </section>
    </div>
  );
}
